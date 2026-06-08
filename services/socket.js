const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Chat = require('../models/chat');
const chatService = require('./chatService');

let io;

function initialize(server) {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.userId}`);
    if (socket.userRole === 'admin') {
      socket.join('admin');
    }

    socket.on('chat:send', async ({ chatId, text }) => {
      try {
        const message = await chatService.sendMessage(chatId, socket.userId, text);
        const chat = await Chat.findById(chatId);
        chat.participants.forEach((p) => {
          const pid = p.toString();
          if (pid !== socket.userId) {
            io.to(`user:${pid}`).emit('chat:message', message);
          }
        });
        socket.emit('chat:message', message);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('chat:typing', ({ chatId, isTyping }) => {
      socket.to(`chat:${chatId}`).emit('chat:typing', { chatId, userId: socket.userId, isTyping });
    });

    socket.on('chat:read', async ({ chatId }) => {
      try {
        await chatService.markAsRead(chatId, socket.userId);
        const chat = await Chat.findById(chatId);
        chat.participants.forEach((p) => {
          const pid = p.toString();
          if (pid !== socket.userId) {
            io.to(`user:${pid}`).emit('chat:read', { chatId, readBy: socket.userId });
          }
        });
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('disconnect', () => {

    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

module.exports = { initialize, getIO };
