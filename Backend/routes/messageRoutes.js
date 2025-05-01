const express = require('express');
const router = express.Router();
const { sendMessage, getConversation } = require('../controllers/messageController');

router.post('/', sendMessage);
router.get('/:user1Id/:user2Id', getConversation);

module.exports = router;
