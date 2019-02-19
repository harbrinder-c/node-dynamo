const express = require('express');
const router = express.Router();
const passport = require('passport');
// Load User model
const User = require('../models/BaseTable');
// Login Page
router.get('/', (req, res) => {
    User.getUniversities().then(function(result){
      console.log('Finished city list function');
      res.render('universities/index', {
        universities: result
      });
    });
});

//create University in database and redirect to listing
router.post('/add', (req, res) => {
    console.log('Calling add city function');
    User.addUniversity(req).then(function(result){
    	console.log('Finished add city function');
    	res.redirect('/universities');
    });    
});

module.exports = router;