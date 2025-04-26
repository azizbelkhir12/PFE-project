const express = require('express');
const donorController = require('../controllers/donorController'); 
const router = express.Router();



// Register a new donor
router.post('/register', donorController.registerDonor); 
router.get('/donors', donorController.getAllDonors); 

module.exports = router;