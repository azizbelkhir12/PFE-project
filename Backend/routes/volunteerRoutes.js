const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const {auth} = require('../utils/auth'); // Assuming you have an auth middleware for authentication

 

router.get('/volunteers', volunteerController.getAllVolunteers);

router.put('/:id/status', volunteerController.changeVolunteerStatus);

module.exports = router;