const express = require("express");
const router = express.Router({mergeParams: true});
const passport = require("passport");
const User = require("../models/user")

// === HOME ===
router.get("/", function(req, res){
    res.render("landing");
});
// === ====
// AUTHENTICATION
// show signup form
router.get("/register", (req, res) =>{
    res.render("register");
});
// handle signup logic
router.post("/register", (req, res) =>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) =>{
        if(err){
            req.flash("error", err.message)
            res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", (req, res) =>{
    res.render("login");
});
//  handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),    
);

// logout logic
router.get("/logout", (req, res) =>{
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("campgrounds");
});


module.exports = router;