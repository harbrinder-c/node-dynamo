const express = require('express');
const router = express.Router();
const passport = require('passport');
// Load User model
const BaseTable = require('../models/BaseTable');

// Course listing page
router.get('/', (req, res) => {
    BaseTable.getCourses().then(function(courses){
      BaseTable.getUniversities().then(function(universites){
        res.render('courses/index', {
          courses: courses,
          universites : universites,
          active : 'courses'
        });
      });
    });
});

//create course in database and redirect to listing
router.post('/add', (req, res) => {
    
    if(req.body.action && req.body.action == 'add')
    {
      console.log('Calling add Course function');
      BaseTable.addCourse(req).then(function(result){
        res.redirect('/courses');
      });
    }
    else
    {
      console.log('Calling update Course function');
      BaseTable.updateCourse(req).then(function(result){
        res.redirect('/courses');
      });
    }    
});

//create University in database and redirect to listing
router.get('/edit', (req, res) => {
    BaseTable.getCourse(req.query.course_uuid).then(function(course){
      res.json(course);
    });    
});

//create University in database and redirect to listing
router.get('/delete', (req, res) => {
    BaseTable.deleteCourse(req.query.course_uuid).then(function(course){
      res.json(course);
    });    
});

module.exports = router;