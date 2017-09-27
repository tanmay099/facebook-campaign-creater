var express = require('express');
var app = express();
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local');
var  methodOverride = require("method-override");

var request = require('request');
var mongoose = require('mongoose');
var Brand = require('./models/brand');
var Campaign = require('./models/campaign');

//mongo lab credtials
mongoose.connect('mongodb://tanmay099:tanmay099@ds141434.mlab.com:41434/brand_campaign',function(err,res){
  if(err){
  console.log(err.message);
  }else{
    console.log("connected");
    
  }
});

//requiring the routes
var campaignRoutes = require('./routes/campaign');
var indexRoutes = require('./routes/index');


app.use(flash());
app.use(require("express-session")({
    secret: "I am the best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"))
passport.use(new LocalStrategy(Brand.authenticate()));
passport.serializeUser(Brand.serializeUser());
passport.deserializeUser(Brand.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});





// Create a new Express application.


// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());

app.use(require('body-parser').urlencoded({ extended: true }));
//app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  
  res.setHeader('Cache-Control', 'no-cache');
  next();
});


app.use('/',indexRoutes);
app.use('/campaign',campaignRoutes);


  

app.listen(process.env.PORT || 3000, process.env.IP ,function(req,res){

console.log("App is live and Counting...");

});