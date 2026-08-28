const expres=require("express");
const app=express();
const Listing=require("../models/listing");
let category=document.getElementsByClassName("cateogry").value;
let listing=Listing.findMany({category:category});
app.get("/category",async (req,res)=>{
    res.render("/listings/index.ejs",{listing});
})