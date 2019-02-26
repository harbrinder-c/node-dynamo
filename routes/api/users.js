const express = require('express');
const apiRoutes = express.Router();
const bcrypt = require('bcryptjs');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../../config/config'); // get our config file

// Load BaseTable
const BaseTable = require('../../models/BaseTable');


//add new user
apiRoutes.post('/sign-up', function(req, res) {

  //first find if email already taken or not
  BaseTable.getUser(req.body.email)
    .then(user => {
      if (user.Items.length > 0) {
          res.json({ success: false, message: 'This email is already taken.' });
      }

      //now we can add the coming user to our database
      BaseTable.addUser(req)
        .then(result => {
            if (!result) {
              res.status(500).json({ success: false, message: 'Some error while adding user.' });
            } else {
              res.status(200).json({ success: true, message: 'User successfully added.' });
            }
        });
    });
});

apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  BaseTable.getUser(req.body.email)
  .then(user => {
        if (user.Items.length == 0) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
        }

        // Match password
        bcrypt.compare(req.body.password, user.Items[0]["password"], (err, isMatch) => {
          // if (err) throw err;
          if (err) {
            console.log("This is error");
          }
          if (isMatch) {
            
            // Now we will create token and save following information in it.
            const payload = { 
                UserSK: user.Items[0]["SK"], 
                name: user.Items[0]["name"], 
                email: user.Items[0]["email"]   
            };

            var token = jwt.sign(payload, config.secret, {
              expiresIn : 60*60*24 // expires in 24 hours
            });

            // return the information including token as JSON
            res.status(200).json({
              success: true,
              message: 'Token successfully created for 24 hours.',
              token: token
            });

          } else {
            res.status(422).json({ success: false, message: 'Authentication failed. Wrong password.' });
          }
        });
  });
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {       if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });       } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;         next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
});

apiRoutes.get('/test', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Lessn APIs!!!!!', decoded: req.decoded });
});

module.exports = apiRoutes;