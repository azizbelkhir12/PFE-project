const mongoose = require('mongoose');

const AbonnementSchema = new mongoose.Schema({
    volunteer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Volunteer', 
        required: true 
    },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
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
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
},{ timestamps: true });

module.exports = mongoose.model('Abonnement', AbonnementSchema);