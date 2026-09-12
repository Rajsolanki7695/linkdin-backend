const socketIO = require("./socket.server");

function registerChatSocket(io) {
  io.on("connection", (socket) => {
    socket.on("join_chat", ({ userId, otherUserId }) => {
      if (!userId || !otherUserId) return;
      const room = [String(userId), String(otherUserId)].sort().join("_");
      socket.join(room);
    });

    socket.on("send_chat_message", (payload) => {
      if (!payload?.receiverId) return;
      const room = [String(payload.senderId), String(payload.receiverId)]
        .sort()
        .join("_");
      io.to(room).emit("receive_chat_message", payload);
    });
  });
}

module.exports = { registerChatSocket };
