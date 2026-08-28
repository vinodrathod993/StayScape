const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
let mongoo_url="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(mongoo_url);
}
console.log(initData.data);
const initDb=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,owner:"6a81993bc39c0499c358c785"
    }));
    await Listing.insertMany(initData.data);
    console.log("data is intialized");
}
initDb();