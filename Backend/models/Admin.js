const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, default: 'admin' },
    permissions: { type: [String], default: [] }, // Example: ['create', 'delete', 'update']
    adminLevel: { type: String, enum: ['super', 'regular'], default: 'regular' } // Example: Admin level
}) ;

// Hash the password before saving

AdminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('Admin', AdminSchema);