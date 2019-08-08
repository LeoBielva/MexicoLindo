const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground")
const Comment = require("../models/comment");
const middleware = require("../middleware")

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, (req, res) =>{
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {
    // lookup compground using ID
    Campground.findById(req.params.id, (err, campground) =>{
        if(err){
            req.flash("error", err);
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) =>{
                if(err){
                    console.log(err);
                } else {
                    // add user name id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added successfully");
                    res.redirect('/campgrounds/' + campground._id)
                }
            });
        }
    });
});
// EDIT Route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) =>{
    Comment.findById(req.params.comment_id, (err, foundComment) =>{
        if(err){
            res.redirect("back");
            console.log("err");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});
// UPDATE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) =>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
        // re direrct
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Modified successfully")
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

// DESTROY
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) =>{
    Comment.findByIdAndRemove(req.params.comment_id, (err) =>{
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Removed successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;