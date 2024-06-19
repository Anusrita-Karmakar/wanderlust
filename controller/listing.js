const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    // const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    const listing = await Listing.findById(id).populate({path:"reviews",populate:("author")}).populate("owner");

    if(!listing){
      req.flash("error","Requested listing does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  };

  // module.exports.showListingByCategory=async (req, res) => {
  //   let { cateGory } = req.params;
  //   console.log(cateGory);
  //   res.send("received");
  //   // const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  //   // const listing = await Listing.find({category: cateGory }).populate({path:"reviews",populate:("author")}).populate("owner");

  //   if(!listing){
  //     req.flash("error","No such listings of this category exists!");
  //     res.redirect("/listings");
  //   }
  //   res.render("listings/show.ejs", { listing });
  // };

module.exports.createListing=async (req, res,next) => {
  let response= await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
    .send();  
  
  let url=req.file.path;
    let filename=req.file.filename;
    // console.log(req.body.listing.category_select);
    // console.log(req.body.listing.category_input);
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    

    newListing.geometry=response.body.features[0].geometry;
    
    let savelistings=await newListing.save();
    // console.log(newListing.category);

    req.flash("success","New listing created!");
    res.redirect("/listings");
  };

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Requested listing does not exist!");
      res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl.replace("/upload","/upload/w_250,h_250,c_scale");
    res.render("listings/edit.ejs", { listing ,originalImageUrl});
  };

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file!="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
  };

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
  };