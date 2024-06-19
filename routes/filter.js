const express = require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const listingController=require("../controller/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });

router.use(express.urlencoded({ extended: true }));

router.get("/:category",wrapAsync(async(req,res)=>{
    let {category}=req.params;
    console.log(category);
    res.send(received);
}));