const express = require('express');
const router = express.Router();
const abonnementController = require('../controllers/abonnementController');    


router.post('/abonnement', abonnementController.payment);
router.get('/verify/:id', abonnementController.verifyPayment);
router.post('/createAbonnement', abonnementController.createAbonnement);
router.get('/by-volunteer/:volunteerId', abonnementController.getAbonnementByVolunteer);

module.exports = router;