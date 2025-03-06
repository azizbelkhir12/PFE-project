const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    paymentMethod: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Donation', DonationSchema);