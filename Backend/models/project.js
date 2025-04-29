const mongoose = require('mongoose');

const projetSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  montantSoutenu: { type: Number, required: true },
  statut: { type: String, enum: ['en_cours', 'termine', 'en_retard'], required: true },
  imageUrl: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model('Projet', projetSchema);
