const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

// Subscribe to admin room
socket.emit('join', 'admin');

socket.on('post:created', (data) => {
  console.log('📝 post:created', data);
});

socket.on('post:updated', (data) => {
  console.log('✏️ post:updated', data);
});

socket.on('post:deleted', (data) => {
  console.log('🗑️ post:deleted', data);
});

socket.on('user:registered', (data) => {
  console.log('👤 user:registered', data);
});

socket.on('user:created', (data) => {
  console.log('🛠️ user:created', data);
});

socket.on('user:updated', (data) => {
  console.log('🛠️ user:updated', data);
});

socket.on('user:deleted', (data) => {
  console.log('🛠️ user:deleted', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
