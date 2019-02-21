var AWS = require("aws-sdk");
const bcrypt = require('bcryptjs');
const uuid = require('uuid/v1');

// DB Config
const db = require('../config/keys').dynamoKeys;

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

  //this function will return the requested course by matching its UUID
  getUniversity: function(university_uuid) {
    return new Promise(function(resolve,reject) {
      var params = {
          TableName: "BaseTable",
          Key: {
            "PK": "University",
            "SK": university_uuid
          }
      };

      docClient.get(params, function(err, data){
        if (err) {
              console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {        
            resolve(data);
        }
      });
    })
  },    

  //this function will delete the requested course by matching its UUID
  deleteUniversity: function(university_uuid) {
    return new Promise(function(resolve,reject) {
      var params = {
          TableName: "BaseTable",
          Key: {
            "PK": "University",
            "SK": university_uuid
          }
      };

      docClient.delete(params, function(err, data){
        if (err) {
              console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {        
            resolve(data);
        }
      });
    })
  },  

  //this function will be used to update the existing course
  updateUniversity: function(req) {
    return new Promise(function(resolve,reject) {
      var params = {
          TableName: "BaseTable",
          Key: {
            "PK": "University",
            "SK": req.body.university_uuid
          },
          UpdateExpression: 'set #name = :new_name, #address = :new_address',
          ExpressionAttributeValues: {
            ':new_name' : req.body.university_name,
            ':new_address' : req.body.university_address
          },
          ExpressionAttributeNames: {
            "#name": "name",
            "#address": "address"
          }
      };
      
      docClient.update(params, function(err, result) {
         if (err) {
             resolve(err);
         } else {
          console.log(result);
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

  //this function will return the requested course by matching its UUID
  getCourse: function(course_uuid) {
    return new Promise(function(resolve,reject) {
      var params = {
          TableName: "BaseTable",
          Key: {
            "PK": "Course",
            "SK": course_uuid
          }
      };

      docClient.get(params, function(err, data){
        if (err) {
              console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {        
            resolve(data);
        }
      });
    })
  },    

  //this function will delete the requested course by matching its UUID
  deleteCourse: function(course_uuid) {
    return new Promise(function(resolve,reject) {
      var params = {
          TableName: "BaseTable",
          Key: {
            "PK": "Course",
            "SK": course_uuid
          }
      };

      docClient.delete(params, function(err, data){
        if (err) {
              console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {        
            resolve(data);
        }
      });
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
  }, 

  //this function will be used to update the existing course
  updateCourse: function(req) {
    return new Promise(function(resolve,reject) {
      var params = {
          TableName: "BaseTable",
          Key: {
            "PK": "Course",
            "SK": req.body.course_uuid
          },
          UpdateExpression: 'set #name = :new_name, #university_uuid = :new_university_uuid',
          ExpressionAttributeValues: {
            ':new_name' : req.body.course_name,
            ':new_university_uuid' : req.body.university_uuid
          },
          ExpressionAttributeNames: {
            "#name": "name",
            "#university_uuid": "university_uuid"
          }
      };
      
      docClient.update(params, function(err, result) {
         if (err) {
             resolve(err);
         } else {
          console.log(result);
             resolve(result);
         }
      });
    })
  }
};
