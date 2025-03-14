const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DonorSchema = new mongoose.Schema({
    ame: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, default: 'donor' },
    donationHistory: [{
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary' }
    }],
});

// Hash the password before saving it to the database
DonorSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('Donor', DonorSchema);