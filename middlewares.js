const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./util/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("error","you must be logged in to create listings !");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
    next();
}
module.exports.isOwner=async (req,res,next)=>{
    const { id } = req.params;
        let listing=await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing does not exsists");
            return res.redirect("/listings");
        }
     if( !listing.owner.equals(res.locals.curruser._id)){
        req.flash("error","you are not the owner of these website");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
}
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const message = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, message);
    }

    next();
};
module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,result.error);
    }else{
        next();
    }
}
module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error","you are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};