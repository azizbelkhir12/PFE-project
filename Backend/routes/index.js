const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to Tunisia Charity Platform API');
});

module.exports = router;