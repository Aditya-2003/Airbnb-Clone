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
    res.render("listings/show.ejs", { 
        listing, 
        currentUser, 
        maptilerKey: process.env.MAPTILER_API_KEY 
    }); // Pass the MapTiler API key to the template
}

module.exports.createListing = async (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for Listing");
    }
    let url = req.file.path; 
    let filename = req.file.filename;
    
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id; // Set the owner to the current user
    newlisting.image = { url, filename }; // Set the image field with the uploaded file's path and filename
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

    let originalImageUrl = listing.image.url; 
    originalImageUrl = originalImageUrl.replace("/uploads/", "/uploads/w_250"); 
    res.render("listings/edit.ejs", { listing , originalImageUrl });
}

module.exports.editListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for Listing");
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file !== 'undefined') {
        let url = req.file.path; 
        let filename = req.file.filename;
        listing.image = { url, filename }; 
        await listing.save();
    }
    
    req.flash("success", "Listing Updated!");
    res.redirect('/listings')
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings');
}