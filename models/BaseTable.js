var AWS = require("aws-sdk");
const bcrypt = require('bcryptjs');
const uuid = require('uuid/v1');

// DB Config
const db = require('../config/config').db;

AWS.config.update(db);
var docClient = new AWS.DynamoDB.DocumentClient();



module.exports = {

  //this function will be used to create a new user
  getUser: function(userEmail) {
    return new Promise(function(resolve,reject) {
      var params = {
          TableName: "BaseTable",
          IndexName: 'GSI-Login',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: { ':email': userEmail }
      };

      docClient.query(params, function(err, result) {
        if (err) {
            resolve(err);
        } else {
            resolve(result);
        }
      })
    });
  },

  //this function will be return all the added Universities in the database
  getUniversities: function() {
    return new Promise(function(resolve,reject) {
      var params = {
          TableName: "BaseTable",
          FilterExpression:"PK = :type",
          ExpressionAttributeValues: {
              ":type": "University"
          }
      };

      docClient.scan(params, onScan);
      var count = 0;

      function onScan(err, result) {
          if (err) {
              console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
          } else {        
              // console.log("Scan succeeded.");
              // data.Items.forEach(function(itemdata) {
              //    console.log("Item :", ++count,JSON.stringify(itemdata));
              // });
              resolve(result);
              // continue scanning if we have more items
              // if (typeof data.LastEvaluatedKey != "undefined") {
              //     console.log("Scanning for more...");
              //     params.ExclusiveStartKey = data.LastEvaluatedKey;
              //     docClient.scan(params, onScan);
              // }
          }
      }
    })
  },  


  //this function will be used to create a new user
  addUniversity: function(req) {
    return new Promise(function(resolve,reject) {
      var params = {
          TableName: "BaseTable",
          Item: {
              "PK": 'University',
              "SK": uuid(),
              "name": req.body.university_name,
              "address": req.body.university_address
          }
      };

      docClient.put(params, function(err, result) {
         if (err) {
             resolve(err);
         } else {
             resolve(result);
         }
      });
    })
  },

  //this function will be return all the added Universities in the database
  getCourses: function() {
    return new Promise(function(resolve,reject) {
      var params = {
          TableName: "BaseTable",
          FilterExpression:"PK = :type",
          ExpressionAttributeValues: {
              ":type": "Course"
          }
      };

      docClient.scan(params, onScan);
      var count = 0;

      function onScan(err, result) {
          if (err) {
              console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
          } else {        
              // console.log("Scan succeeded.");
              // data.Items.forEach(function(itemdata) {
              //    console.log("Item :", ++count,JSON.stringify(itemdata));
              // });
              resolve(result);
              // continue scanning if we have more items
              // if (typeof data.LastEvaluatedKey != "undefined") {
              //     console.log("Scanning for more...");
              //     params.ExclusiveStartKey = data.LastEvaluatedKey;
              //     docClient.scan(params, onScan);
              // }
          }
      }
    })
  },  


  //this function will be used to create a new user
  addCourse: function(req) {
    return new Promise(function(resolve,reject) {
      var params = {
          TableName: "BaseTable",
          Item: {
              "PK": 'Course',
              "SK": uuid(),
              "name": req.body.course_name,
              "university_uuid": req.body.university_uuid
          }
      };

      docClient.put(params, function(err, result) {
         if (err) {
             resolve(err);
         } else {
             resolve(result);
         }
      });
    })
  }
};
