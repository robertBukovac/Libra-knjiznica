var express = require("express")
var router = express.Router();
// passport i User nije definiran pa cemo morat importat Usera i passporta
var passport = require("passport");
var User = require("../models/user");

//ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");
});

router.get("/aboutUs",function(req,res){
    res.render("aboutus")
})
///////////////////////////
// AUTH ROUTES
//////////////////////

/// show register form 
router.get("/register",function(req,res){
    res.render("register");
})
//sign up logic
router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    if(req.body.adminCode === "secretcode123"){
        newUser.isAdmin = true;
    }
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message)
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Dobrodošli u Libru " +user.username)
            res.redirect("/books")
        });
    });
});

//show login form
router.get("/login",function(req,res){  
    res.render("login"); 
})
// handling login logic i logira i middleware,ovo usredini  
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/books", 
        failureRedirect:"/login"
    }),function(req,res){ 
}) 
// logout route
router.get("/logout",function(req,res){ 
    req.logout();
    req.flash("success","Uspješno ste se odjavili") 
    res.redirect("/books");
})

module.exports=router;
