const mongoose = require('mongoose');

const rapportSchema = new mongoose.Schema({
  titre: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['financier', 'litteraire'], 
    required: true 
  },
  file: {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    originalName: { type: String, required: true }
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Rapport', rapportSchema);