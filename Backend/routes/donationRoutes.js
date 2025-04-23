// routes/donations.js
const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');


router.post('/createDon', donationController.createDonation);

module.exports = router;
