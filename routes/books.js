var express = require("express");
var router  = express.Router();
var Book = require("../models/book");
var middleware = require("../middleware");
var open = require("open")
///////////////////////
var http = require("http")
var url = require("url")
var fs = require("fs")

//INDEX - show all campgrounds
router.get("/books", function(req, res){
    var noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Book.find({name: regex}, function(err, allBooks){
            if(err){
                console.log(err);
            } else {
                if(allBooks.length < 1) {
                    noMatch = "Nema knjiga sa takvim imenom,pokušajte ponovo"
                }
               res.render("books/index",{books:allBooks,noMatch:noMatch});
            }
         });
    }
    // Get all books from DB
    Book.find({}, function(err, allBooks){
       if(err){
           console.log(err);
       } else {
          res.render("books/index",{books:allBooks,noMatch:noMatch});
       }
    });
});

//CREATE - add new campground to DB
router.post("/books", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var writer = req.body.writer;
    var image = req.body.image;
    var desc = req.body.description;
    var url = req.body.url;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newBook = {name: name, writer:writer,url:url, image: image, description: desc, author:author}
    // Create a new book and save to DB
    Book.create(newBook, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to books page
            console.log(newlyCreated);
            res.redirect("/books");
        }
    });
});

//NEW - show form to create new campground
router.get("/books/new", middleware.isLoggedIn, function(req, res){
   res.render("books/new"); 
});

// SHOW - shows more info about one book
router.get("/books/:id", function(req, res){
    //find the campground with provided ID
    Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){
        if(err || !foundBook){
            req.flash("error","Book not found");
            res.redirect("back")
        } else {
            console.log(foundBook)
            //render show template with that book
            res.render("books/show", {book: foundBook});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/books/:id/edit", middleware.checkBookOwnership, function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        res.render("books/edit", {book: foundBook});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/books/:id",middleware.checkBookOwnership, function(req, res){
    // find and update the correct campground
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){
       if(err){
           res.redirect("/books");
       } else {
           //redirect somewhere(show page)
           res.redirect("/books/" + req.params.id);
       }
    });
});

// DESTROY book ROUTE
router.delete("/books/:id",middleware.checkBookOwnership, function(req, res){
   Book.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/books");
      } else {
          res.redirect("/books");
      }
   });
});

// zastita ddos napada 

function escapeRegex(str) {
    return str.toString().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;

