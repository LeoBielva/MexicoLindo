var mongooose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {name: "Azcapotzalco",
    img: "https://elsouvenir.com/wp-content/uploads/2019/02/azcapotzalco-dest-560x600.jpg",
    description: "Azcapotzalco es una expresión náhuatl3​ que significa en los hormigueros. Azcatl significa hormiga, potzoa o potzalli, montículo, y co que significa en el hormiguero"    
    }
]

function seedDB(){
    Campground.remove({}, (err) => {
        if(err){
            console.log(err);
        }
        console.log("campgrounds removed");
        //add a few campgrounds
        data.forEach(function (seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log(campground);
                    // Create a comment
                    Comment.create(
                        {
                            text: "This place is great, but not secure at all",
                            author: "Benito J"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("comment");
                            }
                        }
                    );
                }
            });
        });
    });   
}
module.exports = seedDB