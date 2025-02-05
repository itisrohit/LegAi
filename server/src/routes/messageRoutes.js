const express = require('express');
const { botChat } = require('../controllers/core-v1/botChatController');

const router = express.Router();

// Route to add a new message to a chat (POST /api/v1/messages/:chatId)
router.post('/:id', botChat);

module.exports = router;
