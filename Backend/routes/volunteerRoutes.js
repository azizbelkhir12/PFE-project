const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

router.get('/volunteers', volunteerController.getAllVolunteers);

module.exports = router;