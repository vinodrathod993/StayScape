const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../util/wrapAsync.js");
const {isReviewAuthor}=require("../middlewares.js");
const controllesreview=require("../controllers/review.js");
const {isLoggedIn,isOwner,validateListing,validatereview}=require("../middlewares.js");
// const validatereview=(req,res,next)=>{
//     let {error}=reviewSchema.validate(req.body);
//     if(error){
//         throw new ExpressError(400,result.error);
//     }else{
//         next();
//     }
// }
router.post("/",isLoggedIn,validatereview,wrapAsync(controllesreview.postreview));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(controllesreview.deletereview));
module.exports=router;