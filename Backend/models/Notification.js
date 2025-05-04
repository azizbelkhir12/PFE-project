const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    titre: { 
        type: String, 
        required: true 
    },
    contenu: { 
        type: String, 
        required: true 
    },
    idBeneficiaire: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Beneficiary', 
        required: true 
    },
    dateEnvoi: { 
        type: Date, 
        default: Date.now 
    },
    lu: { 
        type: Boolean, 
        default: false 
    }
});

module.exports = mongoose.model('Notification', notificationSchema);