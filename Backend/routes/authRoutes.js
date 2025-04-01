const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//login route

router.post('/login', authController.login);

router.post('/register-admin', authController.registerAdmin);

module.exports = router;