import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "../modules/user/user.model.js";
import { Message } from "../modules/chat/chat.model.js";
import {
  saveMessageService,
  markMessagesAsReadService,
} from "../modules/chat/chat.service.js";

const userSocketMap = new Map();

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];
      if (!token)
        return next(new Error("Authentication error: No token provided"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id).select("name avatar");
      if (!user) return next(new Error("Authentication error: User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid credentials"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    userSocketMap.set(userId, socket.id);
    socket.join(userId);

    io.emit("user_status", { userId, status: "online" });

    // Handle incoming chat message
    socket.on("send_message", async ({ receiverId, message }, callback) => {
      try {
        const savedMessage = await saveMessageService(
          socket.user._id,
          receiverId,
          message,
        );
        const isRecipientOnline = userSocketMap.has(receiverId);

        // If recipient is online, elevate status to delivered
        if (isRecipientOnline) {
          savedMessage.status = "delivered";
          await Message.findByIdAndUpdate(savedMessage._id, {
            status: "delivered",
          });
        }

        // Deliver to recipient room
        io.to(receiverId).emit("new_message", savedMessage);

        // Acknowledge back to sender
        if (callback) callback({ success: true, data: savedMessage });
      } catch (error) {
        if (callback) callback({ success: false, error: error.message });
      }
    });

    // Handle read receipt trigger
    socket.on("mark_read", async ({ senderId }) => {
      try {
        await markMessagesAsReadService(socket.user._id, senderId);
        // Inform the sender that their messages were read
        io.to(senderId).emit("messages_read", { readBy: socket.user._id });
      } catch (error) {
        console.error("Failed to mark messages as read:", error);
      }
    });

    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
      io.emit("user_status", { userId, status: "offline" });
    });
  });

  return io;
};
