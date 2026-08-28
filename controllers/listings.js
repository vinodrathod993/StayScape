const Listing=require("../models/listing");
module.exports.index=async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};
module.exports.showListing=(req,res)=>{
    
    res.render("listings/new.ejs");
};
module.exports.postListing=async (req, res) => {
    console.log(req.file);
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url);
    console.log(filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();

    req.flash("success", "New listing is created!");
    res.redirect("/listings");
}
module.exports.particularpage=async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    }}).populate("owner");
    console.log(listing);
    if (!listing) {
        req.flash("error", "Listing Does Not Exist");
        return res.redirect("/listings");
    }
     
    res.render("listings/show.ejs", { listing});
};
module.exports.accesspage=async (req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    
    let originalurl=list.image.url;
     originalurl=originalurl.replace("/upload","/upload/,w_250")
    // console.log(list);
    res.render("listings/edit.ejs",{list,originalurl});
};
module.exports.updatepage=async (req, res) => {
    const { id } = req.params;
    // let listing=await Listing.findById(id);
    // if(!listing){
    //     req.flash("error","Listing does not exsists");
    //     return res.redirect("/listings");
    // }
   
    let listing=await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        {
            new: true,
            runValidators: true
        }
    );
    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};
module.exports.deletepage=async (req,res)=>{
    let {id}=req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success", "Listing is deleted");
    res.redirect("/listings");
};