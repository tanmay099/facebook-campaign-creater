var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var brandSchema = new mongoose.Schema({
   username : String,
   brand_name: String,
   password: String,
   email:  String, 
   
   phone_num: Number,
   brand_logo: String

   
    });
brandSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('Brand',brandSchema);