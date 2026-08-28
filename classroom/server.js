const express=require('express');
const app=express();
const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
app.use(session({secret:"mysupersecretstring",resave:false,saveUninitialized:true}));
app.use(cookieParser("secretcode"));
app.use(flash());
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use((req,res,next)=>{
     res.locals.messages=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})
app.get("/test",(req,res)=>{
    res.send("test successful");
});
app.get("/name",(req,res)=>{
    let {name="anonoyms"}=req.query;
    req.session.name=name;
    if(name==="anonoyms"){
        req.flash("error","Error is occurred while registring");
    }else{
        req.flash("success","user registered successfully");
    }
    // req.flash("success","user registered successfully");
    res.send("hello");
    
})
app.get("/display",(req,res)=>{
    // res.locals.messages=req.flash("success");
    // res.locals.error=req.flash("error");
    // console.log(req.session);
    // console.log(req.flash("success"));
    // const msg=req.flash("success");
    res.render("first.ejs",{name:req.session.name});
})
app.listen(3000,(req,res)=>{
    console.log(`the app is listening on the port 3000`);
})