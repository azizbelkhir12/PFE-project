const express = require('express');
const { registerDonor } = require('../controllers/donorController'); // Import the function


const router = express.Router();

// Register a new donor
router.post('/register', registerDonor); // Use the imported function

module.exports = router;