var express = require('express');
var Campaign = require('../models/campaign');
var Details = require('../models/userdetails.js');
var passport = require('passport');
var request = require('request');
var popup = require('window-popup').windowPopup;
var Strategy = require('passport-facebook').Strategy;
var middleware = require("../middleware");
var router  = express.Router({mergeParams: true});
var accessToke;


//facebook strategy for for passport js
passport.use(new Strategy({
    clientID: 1447676945353198,
    clientSecret: "210f384ab44c79cd2fca466974603fd2",
    callbackURL: 'https://brandcampain.herokuapp.com/campaign/login/facebook/return'
  },
function(accessToken, refreshToken, profile, cb) {

    
  
    accessToke = accessToken;
    return cb(null, profile);
  }));
  
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
}); 

//campaign routes for user faccbook login
router.get('/login/facebook',  
  passport.authenticate('facebook', { scope: ['user_friends','email'] }
));
//calback routes
router.get('/login/facebook/return',
  passport.authenticate('facebook'),
  function(req, res) {
      
     res.render('campaign/profile', { user: req.user })
     Details.create({id: req.user.id, name: req.user.displayName },function(err,details){
         if(err){
             console.log(err);
         }
         else{
             console.log(details);
             
         }
         
         
     });
     
  });

 //posting to the facebook wall posting request 
router.post('/post',require('connect-ensure-login').ensureLoggedIn(), function(req,res) {
    const id = req.user.id;  
const access_token = req.session.access_token;

const postTextOptions = {  
  method: 'POST',
  uri: `https://graph.facebook.com/v2.8/${id}/feed`,
  qs: {
    access_token: access_token,
   caption:  "" + req.body.name + req.body.description+ "",
      
    url: req.body.image
  }
};


request(postTextOptions, function(err, resp, body) {
  if (err) {
  console.error(err)
    return;
  }
  body = JSON.parse(body);
  if (body.error) {
  var error = body.error.message;
   req.flash("error", "Error returned from facebook: "+ body.error.message);
            return res.redirect("/");
  }
var return_ids = body.id.split('_');
  var user_id = return_ids[0];
  var post_id = return_ids[1];
  var post_url = "https://www.facebook.com/"+user_id+"/posts/"+post_id;
  res.send(post_url);
 });

}); 
  
 //proile page route whis extract user data 
router.get('/profile',require('connect-ensure-login').ensureLoggedIn(),function(req, res){
     res.render('campaign/profile', { user: req.user });
     console.log(req.user.id);
});
//index routes for the getting all the campaign
router.get('/',function(req,res){
    //get all the campaign
    Campaign.find({},function(err,allCampaign){
        if(err){
            console.log(err);
            
        }else{
            
            res.render('campaign/index',{campaign : allCampaign})
            
        }
         })
     });
//create a campaign route
router.get('/createCampaign' ,function(req,res){
res.render('campaign/create');
});

router.post('/createCampaign', middleware.isLoggedIn ,function(req,res){
 
   Campaign.create({campaign_name : req.body.campaign_name, desc_campaign: req.body.desc_campaign,
   start_date : new Date(req.body.start_date),end_date: new Date(req.body.end_date), campaign_image: req.body.campaign_image},function(err,allcampaign){
if(err){
    
    console.log(err);
}else{
    
    res.redirect('/campaign');
    
}                    
       })
  });
 //search routes from facebook users in databases 
router.get("/users",function(req,res){
    
    Details.findOne({name: req.body.name},function(err,details){
       if(err){
           req.flash("error", "Sorry no user found with this name ");  
            res.redirect("/index");
       }
 
       console.log(details);
         res.render("details",{ details: details});
    });
})
  
module.exports = router;