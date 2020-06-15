var express = require("express");
var router  = express.Router({mergeParams: true});
var Book = require("../models/book");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/books/:id/comments/new",middleware.isLoggedIn, function(req, res){
    // find book by id
    console.log(req.params.id);
    Book.findById(req.params.id, function(err, book){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {book: book});
        }
    })
});

//Comments Create
router.post("/books/:id/comments",middleware.isLoggedIn,function(req, res){
   //lookup book using ID
   Book.findById(req.params.id, function(err, book){
       if(err){
           console.log(err);
           res.redirect("/books");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error","Upps, došli smo do greške")
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               book.comments.push(comment);
               book.save();
               console.log(comment);
               req.flash("success","Uspješno dodan komentar")
               res.redirect('/books/' + book._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/books/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Book.findById(req.params.id,function(err,foundBook){
        if(err || !foundBook){
            req.flash("error","No Book found")
            return res.redirect("back")
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
              res.render("comments/edit", {book_id: req.params.id, comment: foundComment});
            }
         });
    })
});

// COMMENT UPDATE
router.put("/books/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/books/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/books/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success","Komentar izbrisan !!")
           res.redirect("/books/" + req.params.id);
       }
    });
});

module.exports = router;