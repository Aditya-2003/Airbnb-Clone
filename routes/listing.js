const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require('../utils/wrapasync.js')
const ExpressError = require('../utils/ExpressError.js')
const {listingSchema} = require('../schema.js')

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

router.get(
    "/",
    wrapAsync(async (req, res) => {
        let allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    })
)

router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})

//SHOW ROUTE
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        if(!listing){
            req.flash("error", "Listing not found!");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    })
);

//CREATE ROUTE
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {
        
        if(!req.body.listing){
            throw new ExpressError(400, "Send valid data for Listing");
        }
        let newlisting = new Listing(req.body.listing);
        await newlisting.save();
        req.flash("success", "Added new listing!");
        res.redirect("/listings")
    })
);

router.get(
    '/:id/edit',
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if(!listing){
            req.flash("error", "Listing not found!");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });
    })
);
//Update Route
router.put(
    '/:id',
    validateListing,
    wrapAsync(async (req, res) => {
        if(!req.body.listing){
            throw new ExpressError(400, "Send valid data for Listing");
        }

        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing })
        req.flash("success", "Listing Updated!");
        res.redirect('/listings')
    })
)

router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted!");
        res.redirect('/listings');
    })
)

module.exports = router;