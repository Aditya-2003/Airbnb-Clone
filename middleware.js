module.exports.isLoggedIn = (req, res, next) => {
    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
        // If not authenticated, redirect to login page with an error message
        req.flash("error", "You must be logged in to access this page!");
        return res.redirect("/login");
    }
    // If authenticated, proceed to the next middleware or route handler
    next();
}