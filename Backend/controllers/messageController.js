const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
      const { senderId, senderRole, receiverId, receiverRole, text } = req.body;
      const message = new Message({ 
        senderId, 
        senderRole,
        receiverId, 
        receiverRole,
        text 
      });
      await message.save();
      res.status(201).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.getConversation = async (req, res) => {
  const { user1Id, user2Id } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
