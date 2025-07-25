const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const wrapAsync = require('../utils/wrapasync.js');
const multer  = require('multer')
const { storage } = require('../cloudconfig.js');
const upload = multer({ storage })
const {
    index,
    getNewForm,
    deleteListing,
    editListing,
    getEditForm,
    createListing,
    showListing
} = require('../controllers/listingController.js')

router
    .route("/new")
    .get(
        isLoggedIn,
        getNewForm
)

router
    .route('/')
    .get(wrapAsync(index))      //show all listings
    .post(                      //create new listing
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(createListing)
    );

router
    .route("/:id")
    .get(wrapAsync(showListing))  //show Listing
    .put(
        isLoggedIn,                
        upload.single('listing[image]'),                         //edit Listing
        validateListing,
        isOwner,
        wrapAsync(editListing)
    )
    .delete(                       //delete Listing
        isLoggedIn,
        isOwner,
        wrapAsync(deleteListing)
    );

router
    .route('/:id/edit')
    .get(                               //get edit form
        isLoggedIn,
        wrapAsync(getEditForm)
    );

module.exports = router;