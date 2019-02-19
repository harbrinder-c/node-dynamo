const express = require('express');
const router = express.Router();
const passport = require('passport');
// Load User model
const BaseTable = require('../models/BaseTable');
// Login Page
router.get('/', (req, res) => {
    BaseTable.getCourses().then(function(result){
      console.log('Finished courses list function');
      res.render('courses/index', {
        courses: result
      });
    });
});

//create University in database and redirect to listing
router.post('/add', (req, res) => {
    console.log('Calling add Course function');
    BaseTable.addCourse(req).then(function(result){
      console.log('Finished add Course function');
      res.redirect('/courses');
    });    
});

module.exports = router;