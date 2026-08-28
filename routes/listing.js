const express=require("express");
const router=express.Router();
const wrapAsync=require("../util/wrapAsync.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

const {isLoggedIn,isOwner,validateListing}=require("../middlewares.js");

const Listing=require("../models/listing.js");
const listingController=require("../controllers/listings.js");
// router.get("/",wrapAsync(listingController.index));
router.route("/").get(wrapAsync(listingController.index))
       .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync( listingController.postListing))
    //    .post(upload.single('listing[image]'),(req,res)=> {res.send(req.file)});
router.get("/new",isLoggedIn,listingController.showListing);
router.route("/:id").get(wrapAsync(listingController.particularpage))
     .put(isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.updatepage)).
      delete(isLoggedIn,isOwner,wrapAsync(listingController.deletepage));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.accesspage));
module.exports=router;