const Campground = require("../models/campground");
const Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) =>{
            if(err){
                res.redirect("back");
            } else {
                // owns campground?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
}};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) =>{
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // owns campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You dont have permissions to do that!");
                    res.redirect("back");
                }
            }
        });
    }else {
        req.flash("error", "Not loggedin");
        res.redirect("back");
    }    
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next(); 
    }
    req.flash("error", "Please login first");
    res.redirect("/login");
};

module.exports = middlewareObj;