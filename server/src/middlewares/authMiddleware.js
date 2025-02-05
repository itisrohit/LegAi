const { OAuth2Client } = require("google-auth-library");
const { User } = require("../models/userModel");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers['authorization']?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const decodedToken = ticket.getPayload();
        if (!decodedToken) {
            return res.status(401).json({ status: 'fail', message: 'Invalid Google Token' });
        }

        // Find user by Google ID (sub)
        const user = await User.findOne({ googleId: decodedToken.sub }).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json({ status: 'fail', message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }
};

module.exports = { authenticate };
