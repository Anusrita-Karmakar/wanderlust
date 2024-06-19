const express = require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isAuthor}=require("../middleware.js");
const reviewController=require("../controller/review.js");


router.use(express.urlencoded({ extended: true }));

// Post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
  
//Delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyRoute));

module.exports=router;