const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DonorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ['parrain', 'standard'], default: 'standard' },
    img: { type: String, default: '' },
    /*donationHistory: [{
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary' }
    }],*/
}) ;

// Hash the password before saving it to the database
DonorSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare passwords
DonorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Donor', DonorSchema);