const express = require("express");
const router = express.Router();
const Campground = require("../models/campground")
const middleware = require("../middleware")
// INDEX - show all campgrounds
router.get("/campgrounds", (req, res) => {
    // Get all camprounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", 
            {
                campgrounds: allCampgrounds,
                currentUser: req.user
            });
        }
    });
});



// NEW - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// CREATE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var img = req.body.img;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, img: img, description: desc, author: author};
    // Create new campground and save to database
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            //Redirect to campgrounds page
            res.redirect("/campgrounds");
            console.log(newlyCreated)
        }
    });
});

// SHOW - shows information of one campground
router.get("/campgrounds/:id", (req, res) => {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
             //render show template with that campground
            res.render("campgrounds/show", {Campground: foundCampground});
        }
    });
});

//EDIT
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, (req, res) =>{
    Campground.findById(req.params.id, (err, foundCampground) =>{
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res) =>{
    // find and update campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) =>{
        // re direrct
        if(err){
            res.redirect("/campgrounds");
            console.log(updatedCampground)
        } else {
            res.redirect("/campgrounds/" + req.params.id);
            console.log(updatedCampground)
        }
    });
});

// DESTROY
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, (req, res) =>{
    // find and delete campground
    Campground.findByIdAndRemove(req.params.id, (err) =>{
        if(err){
            res.redirect("/campgrounds");
        } else{
            req.flash("success", "Successfully removed");
            res.redirect("/campgrounds")
        }
    });
});

module.exports = router;