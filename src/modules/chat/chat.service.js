import { Message } from "./chat.model.js";
import { Follow } from "../follow/follow.model.js";
import { User } from "../user/user.model.js";
import { ApiError } from "../../utils/apiError.js";

// Check whether sender is following receiver
export const verifyCanChat = async (senderId, receiverId) => {
  if (senderId.toString() === receiverId.toString()) {
    throw new ApiError(400, "You cannot initiate a chat with yourself");
  }

  const isFollowing = await Follow.exists({
    follower: senderId,
    following: receiverId,
  });

  if (!isFollowing) {
    throw new ApiError(
      403,
      "Forbidden: You can only chat with users you follow",
    );
  }

  return true;
};

// Send and save message
export const saveMessageService = async (senderId, receiverId, messageText) => {
  if (!messageText || messageText.trim() === "") {
    throw new ApiError(400, "Message cannot be empty");
  }

  // Follow check
  await verifyCanChat(senderId, receiverId);

  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    message: messageText.trim(),
  });

  return await message.populate([
    { path: "sender", select: "name avatar" },
    { path: "receiver", select: "name avatar" },
  ]);
};

// Retrieve chat history between two users
export const getChatHistoryService = async (
  user1Id,
  user2Id,
  page = 1,
  limit = 50,
) => {
  const skip = (page - 1) * limit;

  const messages = await Message.find({
    $or: [
      { sender: user1Id, receiver: user2Id },
      { sender: user2Id, receiver: user1Id },
    ],
  })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .populate("sender", "name avatar")
    .populate("receiver", "name avatar");

  return messages;
};

// List all active conversations (unique users exchanged messages with)
export const getConversationsListService = async (currentUserId) => {
  const messages = await Message.find({
    $or: [{ sender: currentUserId }, { receiver: currentUserId }],
  })
    .sort({ createdAt: -1 })
    .populate("sender", "name avatar headline")
    .populate("receiver", "name avatar headline");

  const conversationMap = new Map();

  for (const msg of messages) {
    const isSender = msg.sender._id.toString() === currentUserId.toString();
    const partner = isSender ? msg.receiver : msg.sender;
    const partnerId = partner._id.toString();

    if (!conversationMap.has(partnerId)) {
      conversationMap.set(partnerId, {
        partner,
        lastMessage: msg.message,
        updatedAt: msg.createdAt,
      });
    }
  }

  return Array.from(conversationMap.values());
};

// Add to backend/src/modules/chat/chat.service.js

export const markMessagesAsReadService = async (receiverId, senderId) => {
  await Message.updateMany(
    { sender: senderId, receiver: receiverId, status: { $ne: "read" } },
    { $set: { status: "read" } },
  );
  return true;
};
