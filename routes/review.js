const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapasync.js')
const { isLoggedIn, validateReview, isAuthor } = require('../middleware.js')
const { postReview, deleteReview } = require('../controllers/reviewController.js');

//Review Create Route
router.route('/')
  .post(isLoggedIn, validateReview, wrapAsync(postReview)
  );

//Review Delete ROute
router.route('/:reviewId')
  .delete(isLoggedIn, isAuthor, wrapAsync(deleteReview)
  );

module.exports = router;