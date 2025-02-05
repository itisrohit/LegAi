const { Router } = require('express');
const passport = require('passport');
const router = Router();

// Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    try {
        const { accessToken } = req.authInfo;
        // console.log(req.authInfo);
        // console.log('accessToken: ', accessToken);
        // console.log('refreshToken: ', refreshToken);
        // const user = req.user;

        // Set cookies
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });

        // Log success message
        console.log('Auto-login successful');
        // Send response to frontend
        // res.status(200).json({
        //     status: 'success',
        //     user,
        //     message: 'Auto-login successful',
        //     accessToken,
        //     refreshToken
        // });

        // Redirect to the desired page
        res.redirect(process.env.CLIENT_URL);
    } catch (error) {
        console.error('Error during Google OAuth callback:', error);
        res.redirect('/login');
    }
});

module.exports = router;