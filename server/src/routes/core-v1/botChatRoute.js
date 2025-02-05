const express = require('express');
const { botChat } = require('../../controllers/core-v1/botChatController');

const router = express.Router();


router.post('/:id', botChat);

module.exports = router;