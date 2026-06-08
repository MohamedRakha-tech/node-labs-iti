const chatService = require('../services/chatService');
const { parsePagination, paginatedResponse, successResponse } = require('../utils/helpers');

exports.getOrCreateChat = async (req, res, next) => {
  try {
    const { userId: otherUserId } = req.params;
    const chat = await chatService.getOrCreateChat(req.userId, otherUserId);
    res.status(200).json(successResponse(chat));
  } catch (err) {
    next(err);
  }
};

exports.getMyChats = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req.query, { limit: 20, maxLimit: 50 });
    const { data, total } = await chatService.getMyChats(req.userId, page, limit);
    res.status(200).json(paginatedResponse(data, total, page, limit));
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { page, limit } = parsePagination(req.query, { limit: 50, maxLimit: 100 });
    const { data, total } = await chatService.getMessages(chatId, req.userId, page, limit);
    res.status(200).json(paginatedResponse(data, total, page, limit));
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    await chatService.markAsRead(chatId, req.userId);
    res.status(200).json(successResponse({ read: true }));
  } catch (err) {
    next(err);
  }
};
