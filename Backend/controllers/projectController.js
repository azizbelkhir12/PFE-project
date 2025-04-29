const Projet = require('../models/project');

// Création projet
exports.ajouterProjet = async (req, res) => {
  try {
    const { titre, description, dateDebut, dateFin, montantSoutenu, statut } = req.body;

    const nouveauProjet = new Projet({
      titre,
      description,
      dateDebut,
      dateFin,
      montantSoutenu,
      statut,
      imageUrl: req.imgurUrl || null
    });

    await nouveauProjet.save();
    res.status(201).json({ message: 'Projet ajouté avec succès' });
  } catch (error) {
    console.error('Erreur ajout projet:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getProjets = async (req, res) => {
  try {
    const projets = await Projet.find();

    const projetsLight = projets.map(projet => ({
      _id: projet._id,
      titre: projet.titre,
      description: projet.description,
      dateDebut: projet.dateDebut,
      dateFin: projet.dateFin,
      montantSoutenu: projet.montantSoutenu,
      statut: projet.statut,
      imageUrl: projet.imageUrl, 
      hasImage: !!projet.imageUrl,
      createdAt: projet.createdAt,
      updatedAt: projet.updatedAt
    }));

    res.status(200).json(projetsLight);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des projets' });
  }
};

exports.supprimerProjet = async (req, res) => {
  try {
    const projetId = req.params.id;
    await Projet.findByIdAndDelete(projetId);
    res.status(200).json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du projet' });
  }
};

exports.modifierProjet = async (req, res) => {
  try {
    const projetId = req.params.id;
    const { titre, description, dateDebut, dateFin, montantSoutenu, statut } = req.body;

    const updatedData = { 
      titre, 
      description, 
      dateDebut, 
      dateFin, 
      montantSoutenu, 
      statut,
      ...(req.imgurUrl && { imageUrl: req.imgurUrl })
    };

    const projetModifie = await Projet.findByIdAndUpdate(projetId, updatedData, { new: true });
    res.status(200).json({ message: 'Projet modifié avec succès', projet: projetModifie });
  } catch (error) {
    console.error('Erreur lors de la modification du projet:', error);
    res.status(500).json({ message: 'Erreur lors de la modification du projet' });
  }
};