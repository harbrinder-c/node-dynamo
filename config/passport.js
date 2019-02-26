const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const BaseTable = require('../models/BaseTable');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      
      BaseTable.getUser(email).then(user => {
        if (user.Items.length == 0) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.Items[0]["password"], (err, isMatch) => {
          // if (err) throw err;
          if (err) {
            console.log("This is error");
          }
          if (isMatch) {
            console.log("Password match");
            return done(null, user.Items[0]);
          } else {
            console.log("Password incorrect");
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    console.log("Serialize "+user.email);
    done(null, user.email);
  });

  passport.deserializeUser(function(email, done) {
    console.log("Deserialize "+email);
    BaseTable.getUser(email).then(user => {
        if (user.Items.length == 0) {
          console.log("Not found");
          return done(null, false, { message: 'That email is not registered' });
        }

        done(null, user.Items[0]);
    });
  });
};