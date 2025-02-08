const fetch = require('node-fetch');
const {User} = require('../models/user.model');

const authenticate = async (req, res, next) => {
    try {
        // Retrieve token from cookies or authorization header
        let token = req.cookies?.accessToken || req.headers['authorization']?.replace("Bearer ", "");
        console.log("Raw token:", token);
        
        // If token is not found, respond with unauthorized
        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        // Remove the "accessToken=" prefix if it exists
        if (token.startsWith("accessToken=")) {
            token = token.substring("accessToken=".length);
        }

        console.log("Cleaned token:", token);

        // Verify the access token using Google's tokeninfo endpoint
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
        if (!response.ok) {
            console.log("Invalid Google Access Token");
            return res.status(401).json({ status: 'fail', message: 'Invalid Google Access Token' });
        }
        const tokenInfo = await response.json();

        // Find user by Google ID (sub)
        const user = await User.findOne({ googleId: tokenInfo.sub }).select("-password -refreshToken");
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ status: 'fail', message: 'User not found' });
        }

        req.user = user;
        console.log("Authenticated user:", user);
        next();
    } catch (error) {
        console.error("Error in middleware", error);
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }
};

module.exports = {authenticate} ;