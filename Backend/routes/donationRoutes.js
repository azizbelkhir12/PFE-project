// routes/donations.js
const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');


router.post('/createDon', donationController.createDonation);
router.get('/getAllDonations', donationController.getAllDonations);

module.exports = router;
