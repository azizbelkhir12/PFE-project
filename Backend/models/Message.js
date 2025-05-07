const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
    // no ref if sender can be from multiple collections
  },
  senderRole: {
    type: String,
    enum: ['admin', 'volunteer'],
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  receiverRole: {
    type: String,
    enum: ['admin', 'volunteer'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: { expires: '30d' } // Messages will auto-delete after 30 days
  }
});

module.exports = mongoose.model('Message', messageSchema);
