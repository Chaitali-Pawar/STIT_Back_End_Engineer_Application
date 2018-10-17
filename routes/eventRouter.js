const express = require('express');
const eventRouter = express.Router();
const bodyParser = require('body-parser');
const UserEvent = require('../model/user_event');
const User = require('../model/user');
const httpRequest = require('https');
const authenticate = require('../authenticate');
const options = {
    hostname: 'yv1x0ke9cl.execute-api.us-east-1.amazonaws.com',
    port: 443,
    path: '/prod/events?classificationName=Music&genreId=KnvZfZ7vAee',
    method: 'GET',
    headers: {
        'Authorization': 'Basic ' + new Buffer('stitapplicant' + ':' + 'zvaaDsZHLNLFdUVZ_3cQKns').toString('base64')
     }
  };

eventRouter.use(bodyParser.json());
eventRouter.route('/').
all((req,res,next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next(); 
})
.get(authenticate.verifyUser ,(req,res,next) => {
    // find the user email from the user token id once the user has been authenticated
    User.findById(req.user._id)
    .then((user) =>{
        UserEvent.find({/*email :user.email*/})
        .then((user_event)=> {
            // make an api call to the events api    
            // here I am passing in the authorization header the username and password being provided in the word document.
            httpRequest.get(options, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
      // The whole response has been received.
            resp.on('end', () => {
            console.log(JSON.parse(data));
            res.statusCode =200;
            res.setHeader('Content-type','application/json');
            res.json(data);
            });
        }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
        },err => next(err))
        .catch(err => next (err));
    });
    
})
.post(authenticate.verifyUser,(req,res,next) => {
    // 1.	/register user provides their set of preferences that they are interested in it is stored in a 
    //table user_event that contains the relation between the user email and the preferences namely the category name and genre name. 
    UserEvent.create(req.body)
        .then ((user_event) => {
            console.log (" created user event is"+user_event)
            res.statusCode =200;
            res.setHeader('Content-type','application/json');
            res.json(user_event);
        } , (err) => next(err) )
        .catch(err => next(err)); 
})
.put(authenticate.verifyUser,(req,res,next) => {
      
      User.findById(req.user._id)
      .then((user) => {
            UserEvent.findOneAndUpdate({ "email": user.username }, { "$set": { "category_name": req.body.category_name, "genre_name": req.body.genre_name}}).exec(function(err, userevent){
                if(err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(user_event);
                }
            });
        }); 
});

module.exports = eventRouter


