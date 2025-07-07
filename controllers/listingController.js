const Listing = require("../models/listing");
const ExpressError = require('../utils/ExpressError.js');

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.getNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");
    const currentUser = req.user; // Get the current user from the request
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing, currentUser });
}

module.exports.createListing = async (req, res, next) => {

    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for Listing");
    }
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id; // Set the owner to the current user
    await newlisting.save();
    req.flash("success", "Added new listing!");
    res.redirect("/listings")
}

module.exports.getEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.editListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for Listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect('/listings')
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
}