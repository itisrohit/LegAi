const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { trainChatbot, getResponse } = require('./bot');

const app = express();
app.use(cors());
app.use(bodyParser.json());




trainChatbot().then(() => {
    console.log("Chatbot is ready to handle requests.");
});


app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: "Please provide a valid message." });
        }

        const response = await getResponse(message);
        res.json({ reply: response });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "⚠️ Internal server error. Please try again." });
    }
});


const PORT = 3001;
app.listen(PORT, () => console.log(`Legal AI Assistant running on port ${PORT}`));
