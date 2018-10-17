var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./model/user');
var jwtStrategy = require('passport-jwt').Strategy;  // provide with json web token based strategy
var ExtractJWT = require('passport-jwt').ExtractJwt;

var jwt = require('jsonwebtoken'); // for generating tokens,sign and verify tokens

var config = require('./config');


exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    // to return a token based on user json object
   return jwt.sign(user,config.secretKey,{
        expiresIn:3600
    })
};

// configure the json web based strategy for passport
var opts ={};
// how the token must be extrated from headr
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;
// define the strategy for retreiving users
exports.jwtPassport = passport.use(new jwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

//authenticate a user uses above strategy
exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if(req.user.admin)
        next();
    else{
        var err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        return next(err);
    }
}
