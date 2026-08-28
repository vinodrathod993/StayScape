require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport=require("passport");
const LocalStartegy=require("passport-local");
const User=require("./models/user.js");
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
const mongoose = require("mongoose");

// Set view engine first
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
let dburl = process.env.mongose_x;
async function main() {
    await mongoose.connect(dburl);
}
main().then(() => {
    console.log("connection successful");
    app.listen(port, () => {
        console.log(`The app is listening on port ${port}`);
    });
}).catch((err) => {
    console.log(err);
});
const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.secret,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("error in the mongose session store",error);
})

// Session BEFORE flash
const sessionOptions = {
    store,
    secret:process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // Fixed: expires + 1000
        maxAge: 7 * 24 * 60 * 60 * 1000,  // Fixed: 1000 not 100
        httpOnly: true
    }
};
app.use(session(sessionOptions));

// Flash AFTER session
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Method override before routes
app.use(methodOverride('_method'));
// Make flash messages available to all views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
});

// Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
// MongoDB connection

app.get("/", (req, res) => {
    res.redirect("/listings");
});


// Root route
// app.get("/", (req, res) => {
//     res.send(`hi ,I am root`);
// });

// 404 handler
const ExpressError = require("./util/ExpressError.js");

app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

// Error handler (must be last)
app.use((err, req, res, next) => {
    let { statusCode = 500, message } = err;
    res.status(statusCode).render("listings/error.ejs", { err });
});

// app.listen(port, () => {
//     console.log(`the app is listening on the port ${port}`);
// });