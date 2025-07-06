const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const user = require('../models/user.js');
const wrapAsync = require('../utils/wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

router.get('/signup', (req, res) => {
    res.render("users/signup.ejs");
});

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            console.log(req.originalUrl);
            res.redirect('/listings');
        }); 
    }
    catch (err) {
        if (err.name === 'UserExistsError') {
            req.flash("error", "Username already exists!");
            return res.redirect('/signup');
        }
        throw new ExpressError(500, "Internal Server Error");
    }

})
);

router.get('/login', (req, res) => {
    res.render("users/login.ejs");
})

router.post('/login', 
    saveRedirectUrl,
    passport.authenticate('local', 
        {
            failureRedirect: '/login' , 
            failureFlash: true
        }), 
        async (req, res) => {
            req.flash("success","Welcome Back!!");
            res.redirect(res.locals.redirectUrl || '/listings' ); //if redirectUrl is set, redirect to that, otherwise to listings
}
);

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect('/listings');
    });
});

module.exports = router;
