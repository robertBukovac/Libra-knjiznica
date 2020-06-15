var Book = require('../models/book');
var Comment = require('../models/comment');

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkBookOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Book.findById(req.params.id, function(err, foundBook){
           if(err || !foundBook){
               req.flash('error','Knjiga nije pronađena');
               res.redirect('back');
           }  else {
               // does user own the book?
            if(foundBook.author.id.equals(req.user._id) || req.user.isAdmin ) {
                next();
            } else {
                req.flash('error','Nemate dozvolu to uraditi')
                res.redirect('back');
            }
           }
        });
    } else {
        req.flash('error','Morate biti prijavljeni da bi to uradili !!')
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash('error','Comment not found')
               res.redirect('back');
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash('error','Nemate dozvolu to uraditi !')
                res.redirect('back');
            }
           }
        });
    } else {
        req.flash('error','Morate biti prijavljeni da bi to uradili !!')
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error','Morate biti prijavljeni da bi to uradili !!')
    res.redirect('/login');
}

module.exports = middlewareObj;


