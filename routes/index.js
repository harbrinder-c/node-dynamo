const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', (req, res) => 
	res.render('new/login', {
    	active: 'login',
    	layout: false
 	 })
);
router.get('/login', (req, res) => 
	res.render('new/login', {
    	active: 'login',
    	layout: false
 	 })
);

// Login
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
	    successRedirect: '/courses',
	    failureRedirect: '/login',
	    failureFlash: true
	})(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

module.exports = router;