const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('./config/passport.js');
const { User } = require('./models/user.model.js');

// Load environment variables
// require('dotenv').config();


// Middleware Configuration
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

// Session Configuration (Required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());



// Route Configuration
const userRouter = require('./routes/user.routes.js');

// API routes
app.use('/api/v1/users', userRouter);

// Public Route 
app.get('/', (req, res) => {
  res.send('This API is working');
});


module.exports = { app };