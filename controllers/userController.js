const ExpressError = require('../utils/ExpressError.js');
const User = require('../models/user.js');

module.exports.getSignupPage = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.createAccount = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        
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
}

module.exports.getLoginPage = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome Back!!");
    res.redirect(res.locals.redirectUrl || '/listings'); //if redirectUrl is set, redirect to that, otherwise to listings
}

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect('/listings');
    });
}