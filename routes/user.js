const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const { 
    createAccount, 
    getSignupPage, 
    getLoginPage, 
    loginUser, 
    logoutUser 
} = require('../controllers/userController.js');

router.route('/signup')
    .get(getSignupPage)
    .post(wrapAsync(createAccount));

router.route('/login')
    .get(getLoginPage)
    .post(saveRedirectUrl,
        passport.authenticate('local',
            {
                failureRedirect: '/login',
                failureFlash: true
            }),
        loginUser
    );

router.route('/logout')
    .get(logoutUser);

module.exports = router;
