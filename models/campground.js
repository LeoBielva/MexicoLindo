const mongoose = require("mongoose");

//SCHEMA setup 
var campgroundSchema = new mongoose.Schema({
    name: String,
    img: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String 
    },
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
    ]
});

// Makes a collection in the db
const Campground = mongoose.model("Campground", campgroundSchema);

// Export Schema/Model 
module.exports = Campground;