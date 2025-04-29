const express = require('express');
const router = express.Router();
const uploadImage = require('../utils/uploadImage');
const imgurUpload = require('../utils/imgurUpload');
const projetController = require('../controllers/projectController');

router.post('/saveprojets', 
  uploadImage.single('image'),
  imgurUpload,
  projetController.ajouterProjet
);

router.get('/getProject', projetController.getProjets);
router.delete('/deleteProject/:id', projetController.supprimerProjet);

router.put('/modifyPorject/:id',
  uploadImage.single('image'),
  imgurUpload,
  projetController.modifierProjet
);

module.exports = router;