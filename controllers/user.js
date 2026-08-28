const User=require("../models/user.js");
module.exports.userget=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.userpost=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","Welcome to WanderLust Page !");
    res.redirect("/listings");
    })
    // req.flash("success","Welcome to WanderLust Page !");
    // res.redirect("/listings");
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};
module.exports.login=(req,res)=>{
    res.render('users/login.ejs');
};
module.exports.loginpost=async (req,res)=>{
        req.flash("success","Welcome back to wanderLust !");
        let redirecturl=res.locals.redirecturl || "/listings";
        res.redirect(redirecturl);
    };
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
};