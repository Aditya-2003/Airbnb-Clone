const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session');
const flash = require('connect-flash');

const MONGO_URL = "mongodb://127.0.0.1:27017/AirBnB";

const listings = require('./routes/listing.js');
const reviews  = require('./routes/review.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public/")))

const sessionOptions = {
    secret: "mysupersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 day
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("DB Connection Successful");
    }).catch((err) => {
        console.log(err);
    })

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).render("error.ejs",{err});
})

app.listen(8080, () => {
    console.log("App is Running on Port 8080.");
});
