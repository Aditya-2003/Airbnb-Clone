const express = require('express');
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
const validateReview = ( req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

app.get(
    "/listings",
    wrapAsync(async (req, res) => {
        let allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    })
)

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

//SHOW ROUTE
app.get(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        res.render("listings/show.ejs", { listing });
    })
);

//CREATE ROUTE
app.post(
    "/listings",
    validateListing,
    wrapAsync(async (req, res, next) => {
        if(!req.body.listing){
            throw new ExpressError(400, "Send valid data for Listing");
        }
        let newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings")
    })
);

app.get(
    '/listings/:id/edit',
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    })
);
//Update Route
app.put(
    '/listings/:id',
    validateListing,
    wrapAsync(async (req, res) => {
        if(!req.body.listing){
            throw new ExpressError(400, "Send valid data for Listing");
        }
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing })
        res.redirect('/listings')
    })
)

app.delete(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect('/listings');
    })
)

//Review Create Route
app.post('/listings/:id/reviews',validateReview, wrapAsync(async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

     res.redirect(`/listings/${listing._id}`);
})
);

//Review Delete ROute
app.delete('/listing/:id/reviews/:reviewId' , wrapAsync( async(req,res) => {
  let {id, reviewId} = req.params;

  await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
})
);

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
