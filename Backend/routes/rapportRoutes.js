const express = require('express');
const router = express.Router();
const rapportController = require('../controllers/rapportController');


router.post('/rapports', rapportController.upload.single('file'), rapportController.ajouterRapport);
router.get('/getRapports', rapportController.getRapports);
router.delete('/deleteRapport/:id', rapportController.supprimerRapport);
router.get('/downloadRapport/:id', rapportController.telechargerRapport);

module.exports= router;
