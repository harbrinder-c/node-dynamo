const express = require('express');
const router = express.Router();
const passport = require('passport');
// Load User model
const BaseTable = require('../models/BaseTable');
// Login Page
router.get('/', (req, res) => {
    BaseTable.getUniversities().then(function(result){
      console.log('Finished city list function');
      res.render('universities/index', {
        universities: result,
        active : 'universities'
      });
    });
});

//create University in database and redirect to listing
router.post('/add', (req, res) => {
    if(req.body.action && req.body.action == 'add')
    {
      BaseTable.addUniversity(req).then(function(result){
      	res.redirect('/universities');
      });
    }
    else
    {
      BaseTable.updateUniversity(req).then(function(result){
        res.redirect('/universities');
      });
    }    
});

//create University in database and redirect to listing
router.get('/edit', (req, res) => {
    BaseTable.getUniversity(req.query.university_uuid).then(function(course){
      res.json(course);
    });    
});

//create University in database and redirect to listing
router.get('/delete', (req, res) => {
    BaseTable.deleteUniversity(req.query.university_uuid).then(function(course){
      res.json(course);
    });    
});

module.exports = router;