const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guestName: { type: String, default: null },
  guestEmail: { type: String, default: null },
  paymentMethod: { 
    type: String, 
    enum: ['credit_card', 'bank_transfer', 'cash', 'flouci'],  
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: { type: String, unique: true, sparse: true, default: null }, // Store Flouci payment reference
  paymentDetails: { type: Object, default: null }, // Store full payment verification details
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);