var mongoose = require('mongoose');
var passportMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var User = new Schema({
    firstname: {
        type: String,
          default: ''
      },
      lastname: {
        type: String,
          default: ''
      },
      email :{
          type:String,
          default:''
      },
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportMongoose);
module.exports = mongoose.model('User', User);