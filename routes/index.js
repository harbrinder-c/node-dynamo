const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', (req, res) => 
	res.render('new/login', {
    	active: 'login'
 	 })
);
router.get('/login', (req, res) => 
	res.render('new/login', {
    	active: 'login'
 	 })
);

// Dashboard
// router.get('/dashboard', ensureAuthenticated, (req, res) =>
//   res.render('dashboard', {
//     user: req.user,
//   })
// );

module.exports = router;