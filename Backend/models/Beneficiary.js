const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const BeneficiarySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    familySize: { type: Number, default: 1 }
});

// Hash the password before saving it to the database
BeneficiarySchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('Beneficiary', BeneficiarySchema);