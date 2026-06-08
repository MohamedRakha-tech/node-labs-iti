const Chat = require('../models/chat');
const Message = require('../models/message');
const APIError = require('../utils/APIERROR');

exports.getOrCreateChat = async (userId, otherUserId) => {
  let chat = await Chat.findOne({
    participants: { $all: [userId, otherUserId] },
  }).populate('participants', 'name email avatar');

  if (!chat) {
    chat = await Chat.create({ participants: [userId, otherUserId] });
    chat = await chat.populate('participants', 'name email avatar');
  }

  return chat;
};

exports.getMyChats = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Chat.find({ participants: userId })
      .populate('participants', 'name email avatar')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit),
    Chat.countDocuments({ participants: userId }),
  ]);
  return { data, total };
};

exports.sendMessage = async (chatId, senderId, text) => {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new APIError(404, 'Chat not found.');
  if (!chat.participants.some((p) => p.toString() === senderId)) {
    throw new APIError(403, 'Not a participant of this chat.');
  }

  const message = await Message.create({ chat: chatId, sender: senderId, text });

  chat.lastMessage = { text, sender: senderId, timestamp: new Date() };
  await chat.save();

  const populated = await message.populate('sender', 'name email avatar');
  return populated;
};

exports.getMessages = async (chatId, userId, page = 1, limit = 50) => {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new APIError(404, 'Chat not found.');
  if (!chat.participants.some((p) => p.toString() === userId)) {
    throw new APIError(403, 'Not a participant of this chat.');
  }

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Message.find({ chat: chatId })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Message.countDocuments({ chat: chatId }),
  ]);

  return { data: data.reverse(), total };
};

exports.markAsRead = async (chatId, userId) => {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new APIError(404, 'Chat not found.');
  if (!chat.participants.some((p) => p.toString() === userId)) {
    throw new APIError(403, 'Not a participant of this chat.');
  }

  await Message.updateMany(
    { chat: chatId, sender: { $ne: userId }, readBy: { $ne: userId } },
    { $push: { readBy: userId } }
  );
};
