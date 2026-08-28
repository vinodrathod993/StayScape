const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
module.exports.postreview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let {rating,comment}=req.body.review;
    let newReview=new Review({
        rating:rating,
        comment:comment
    })
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review is created!");
   res.redirect(`/listings/${listing.id}`);
};
module.exports.deletereview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "listing is Deleted");
    res.redirect(`/listings/${id}`);
};