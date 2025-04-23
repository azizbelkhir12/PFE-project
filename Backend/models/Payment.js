const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['credit_card', 'bank_transfer', 'cash'], required: true },
  transactionId: { type: String, required: true },
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
  paymentDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);