const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { User } = require('../models/user.model.js');

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // First-time user, create new user
            user = new User({
                email: profile.emails[0].value,
                fullname: profile.displayName,
                googleId: profile.id,
                accessToken: accessToken, // Store the access token for first-time users
            });

            await user.save();
        } else {
            // Existing user, update their access token (if you want to store it)
            user.accessToken = accessToken;
            await user.save();  // Save the updated access token
        }

        done(null, user);  // Proceed with user
    } catch (error) {
        console.error('Error during Google OAuth callback:', error);
        done(error, null);
    }
}));



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});