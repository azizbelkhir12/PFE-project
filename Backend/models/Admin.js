const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false},
    
    createdAt: { type: Date, default: Date.now }
})

// Hash the password before saving it to the database

AdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// Method to compare passwords
AdminSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('Admin', AdminSchema);

