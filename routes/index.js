var express = require('express');
var passport = require('passport');
var router = express.Router();
var Brand = require('../models/brand.js');







// root routes
  router.get('/',function(req,res){
      
      res.render('login');
      
  });
  router.get('/register',function(req,res){
     res.render('register'); 
      
  });
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new Brand({username: req.body.username , brand_name: req.body.brand_name, email:req.body.email,phone_num: req.body.phone_num, brand_logo: req.body.brand_logo});
    Brand.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to FamusEnuf " + user.username);
           res.redirect("/campaign"); 
        });
    });
});
        
router.get('/login',function(req,res){
   
    res.render("login");
});        
//login route
router.post("/login",passport.authenticate("local",{
    
    successRedirect: "/campaign",
        failureRedirect: "/register"
    
    
}),function(req,res){
      req.flash('success','Welcome back');
    
});



//logout routes
  router.get('/logout',function(req,res){
   req.logout();
   req.flash('success','You been logged out');
   res.render('login');
    
    
    
});
module.exports = router;