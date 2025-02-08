const { Router } = require("express");
const passport = require("passport");

const router = Router();

// Google OAuth
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    try {
        const accessToken = req.user?.accessToken;
        if (!accessToken) {
            console.error("Access Token not found in user object.");
            return res.redirect('/login');
        }

        console.log(accessToken);

        // Set accessToken in a cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: false,  // to prevent access via JavaScript
            secure: false,  // set secure flag in production
            maxAge: 24 * 60 * 60 * 1000,  // 1 day
        });

        console.log('Auto-login successful');
        res.redirect(process.env.CLIENT_URL);
    } catch (error) {
        console.error('Error during Google OAuth callback:', error);
        res.redirect('/login');
    }
});


  


module.exports = router;
