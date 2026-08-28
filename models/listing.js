const mongoose=require("mongoose");
const reviews = require("./review.js");
const { ref } = require("joi");
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:{
    type:String,
    required:true
    },
    description:String,
    image:{
       url:String,
       filename:String,
    },
    price:Number,
    location:String,
    country:String,
    category:{
        type:String,
        enum:["Trending","Rooms","Iconic Cities","Mountains","Castles","Amazing pools","Camping","Farms","Arctic"],
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await reviews.deleteMany({_id:{$in:listing.reviews}});
    }
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;