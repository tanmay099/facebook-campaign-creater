var mongoose = require('mongoose');


var detailSchema = new mongoose.Schema({
   id : Number,
   name : String
//   age_range : String,
//   locale:  String, 
//   email: String,
//   gender: String,
//   user_friends : String

   
    });

module.exports = mongoose.model('Details',detailSchema);