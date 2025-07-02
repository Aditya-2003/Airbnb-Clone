const express = require('express');
const router = express
const mongoose = require('mongoose');
const app = express();
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const wrapAsync = require('./utils/wrapasync.js')
const ExpressError = require('./utils/ExpressError.js')
const {listingSchema , reviewSchema} = require('./schema.js')
const Review = require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/AirBnB";

const listings = require('./routes/listing.js');
const reviews  = require('./routes/review.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public/")))

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("DB Connection Successful");
    }).catch((err) => {
        console.log(err);
    })

app.use("/listings", listings)
app.use("/listings/:id", reviews)

app.get("/", (req, res) => {
    res.redirect("/listings");
});

const validateListing = ( req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

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
