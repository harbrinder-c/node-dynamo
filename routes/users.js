const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
// Login Page
router.get('/login', (req, res) => 
  res.render('new/login', {
      layout: false
   })
);

// Register Page
// router.get('/register', (req, res) => res.render('register'));
router.get('/register', (req, res) =>  {
    console.log('Calling User create function');
    
    User.getUser(1).then(function(data) {
      console.log('Finished User create function');
    });
});

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {


    // User.findOne({ email: email }).then(user => {
    //   if (user) {
    //     errors.push({ msg: 'Email already exists' });
    //     res.render('register', {
    //       errors,
    //       name,
    //       email,
    //       password,
    //       password2
    //     });
    //   } else {
    //     const newUser = new User({
    //       name,
    //       email,
    //       password
    //     });

    //     bcrypt.genSalt(10, (err, salt) => {
    //       bcrypt.hash(newUser.password, salt, (err, hash) => {
    //         if (err) throw err;
    //         newUser.password = hash;
    //         newUser
    //           .save()
    //           .then(user => {
    //             req.flash(
    //               'success_msg',
    //               'You are now registered and can log in'
    //             );
    //             res.redirect('/users/login');
    //           })
    //           .catch(err => console.log(err));
    //       });
    //     });
    //   }
    // });  
    console.log('Calling User create function');
    User.createUser();
    console.log('Finished User create function');


  }
});

// Login
router.post('/login', (req, res, next) => {
  console.log("User login");
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;