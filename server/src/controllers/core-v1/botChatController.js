const { getResponse } = require('../../../agents/corev1');
const { Message } = require('../../models/messageModel');
const { Chat } = require('../../models/chatModel');

const botChat = async (req, res) => {
    try {
        const chatId = req.params.id;
        const { message } = req.body;
        if (!message || message.trim() === '') {
            return res.status(400).json({ error: "Please provide a valid message." });
        }

        // Store the user's message in the database
        const newMessage = new Message({ chatId, user: message });
        await newMessage.save();

        // Get the response from the bot
        const response = await getResponse(message);

        // Update the message with the bot's response
        newMessage.bot = response;
        await newMessage.save();

        // Update the last updated timestamp for the chat
        await Chat.findByIdAndUpdate(chatId, { lastUpdated: Date.now() });

        // Send the bot's response back to the user
        res.json({ reply: response });
    } catch (error) {
        console.error("Error processing /chat request:", error);
        res.status(500).json({ error: "⚠️ Internal server error. Please try again." });
    }
}

module.exports = { botChat };