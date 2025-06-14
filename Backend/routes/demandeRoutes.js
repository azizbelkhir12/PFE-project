const express = require('express');
const router = express.Router();
const demandeController = require('../controllers/demandeController');
const upload = require('../utils/upload');
const {auth} = require('../utils/auth'); 



router.post('/demande', demandeController.Demande);
router.get('/pending', demandeController.getAllDemandes);
router.put('/:id/accept', demandeController.acceptDemande);
router.put('/:id/reject', demandeController.rejectDemande);

module.exports = router;  