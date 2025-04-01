const express = require('express');
const router = express.Router();
const demadneController = require('../controllers/demadneController')
const upload = require('../utils/upload');

router.post('/demande', upload.single('img'), demadneController.Demande);

module.exports = router;  