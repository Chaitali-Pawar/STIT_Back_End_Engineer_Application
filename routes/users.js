var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../model/user');
var passport = require('passport');
var authenticate = require('../authenticate');
router.use(bodyParser.json()); // converts the body of every request into json

router.get('/', authenticate.verifyUser, function(req, res, next) {
  if( authenticate.verfiyAdmin(req.user.admin)){
    User.find({})
   .then((users)=> {
       res.statusCode =200;
       res.setHeader('Content-type','application/json');
       res.json(users);

   },err => next(err))
   .catch(err => next (err));
  }
  else{
    err = new Error('You are not authorized ' + req.user.firstname+' to view users');
    err.status = 403;
    return next(err);  
}
  //res.send('respond with a resource');
});

// define post request for user to sign up

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      console.log("Error"+req.body.username +"pass"+req.body.password);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  // once the user is authenticated using the local strategy , create a token 
  var token = authenticate.getToken({_id: req.user._id});
  console.log("token is"+token);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token,status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});
module.exports = router;

