require('dotenv').config();
const connectDB = require('./config/db.js');
const { app } = require('./app.js');
const http = require('http');
const server = http.createServer(app);
const { trainChatbot } = require('../agents/corev1');

trainChatbot().then(() => {
    console.log("Chatbot is ready to handle requests.");
});

connectDB()
.then(() => {
    server.listen(process.env.PORT || 8080, () => {
        console.log(`Server is running on port ${process.env.PORT || 8080}`);
    });
})
.catch((error) => {
    console.error("MongoDB connection failed !!!", error);
});