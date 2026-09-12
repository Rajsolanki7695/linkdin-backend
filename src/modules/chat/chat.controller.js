import { ApiResponse } from "../../utils/apiResponse.js";
import * as chatService from "./chat.service.js";

export const getMessages = async (req, res, next) => {
  try {
    const { targetUserId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const messages = await chatService.getChatHistoryService(
      req.user._id,
      targetUserId,
      Number(page),
      Number(limit),
    );
    res.status(200).json(new ApiResponse(200, messages, "Messages fetched"));
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await chatService.getConversationsListService(
      req.user._id,
    );
    res
      .status(200)
      .json(new ApiResponse(200, conversations, "Conversations fetched"));
  } catch (error) {
    next(error);
  }
};

export const checkChatPermission = async (req, res, next) => {
  try {
    await chatService.verifyCanChat(req.user._id, req.params.targetUserId);
    res
      .status(200)
      .json(new ApiResponse(200, { allowed: true }, "Chat allowed"));
  } catch (error) {
    next(error);
  }
};
