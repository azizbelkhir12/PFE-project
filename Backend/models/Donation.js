// donationModel.js
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
  paymentType: {
    type: String,
    enum: ['local', 'international'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  project: { type: String, enum: ['Parrainage enfant', 'Rentrée scolaire', 'Ramadan', "Aid Idh'ha", 'Aid Fiter'], required: true  },
  paymentId: { type: String, unique: true, sparse: true, default: null },
  paymentDetails: { type: Object, default: null },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);