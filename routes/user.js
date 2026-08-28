const express=require("express");
const router=express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middlewares.js");
const user=require("../controllers/user.js");
router.route("/signup").get(user.userget).post( wrapAsync(user.userpost));
router.route("/login").get(user.login).post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",failureFlash:true}),user.loginpost
);
router.get("/logout",user.logout);
module.exports=router;