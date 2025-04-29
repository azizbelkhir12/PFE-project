const Rapport = require('../models/Rapport');
const mongoose = require('mongoose');
const upload = require('../utils/upload');

exports.ajouterRapport = async (req, res) => {
  try {
    const { titre, type } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier téléchargé'
      });
    }

    const { buffer, mimetype, originalname } = req.file;

    const rapport = new Rapport({
      titre,
      type,
      file: {
        data: buffer,
        contentType: mimetype,
        originalName: originalname
      }
    });

    await rapport.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Rapport ajouté avec succès',
      rapport: {
        id: rapport._id,
        titre: rapport.titre,
        type: rapport.type,
        date: rapport.date
      }
    });
    
  } catch (error) {
    console.error('Erreur ajout rapport:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'ajout du rapport',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getRapports = async (req, res) => {
  try {
    const rapports = await Rapport.find({}, 'titre type date file.originalName');
    res.status(200).json(rapports);
  } catch (error) {
    console.error('Erreur récupération rapports:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des rapports',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


exports.supprimerRapport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de rapport invalide' 
      });
    }

    const rapport = await Rapport.findByIdAndDelete(id);

    if (!rapport) {
      return res.status(404).json({ 
        success: false, 
        message: 'Rapport non trouvé' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Rapport supprimé avec succès',
      deletedRapport: {
        id: rapport._id,
        titre: rapport.titre
      }
    });

  } catch (error) {
    console.error('Erreur suppression rapport:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la suppression',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.telechargerRapport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Format ID invalide' 
      });
    }

    const rapport = await Rapport.findById(id);

    if (!rapport) {
      return res.status(404).json({ 
        success: false,
        message: 'Rapport non trouvé' 
      });
    }

    if (!rapport.file?.data) {
      return res.status(404).json({ 
        success: false,
        message: 'Fichier non trouvé dans le rapport' 
      });
    }

    res.set({
      'Content-Type': rapport.file.contentType,
      'Content-Disposition': `attachment; filename="${rapport.file.originalName || 'rapport'}"`,
      'Content-Length': rapport.file.data.length
    });

    res.send(rapport.file.data);

  } catch (error) {
    console.error('Erreur de téléchargement:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors du téléchargement',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.upload = upload;