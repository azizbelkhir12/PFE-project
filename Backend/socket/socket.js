const Message = require('../models/Message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
    });

    // In socket/socket.js
socket.on('sendMessage', async (data) => {
    const newMessage = new Message({
      senderId: data.senderId,
      senderRole: data.senderRole,
      receiverId: data.receiverId,
      receiverRole: data.receiverRole,
      text: data.content
    });
  
    await newMessage.save();
  
    io.to(data.receiverId).emit('receiveMessage', newMessage);
  });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
