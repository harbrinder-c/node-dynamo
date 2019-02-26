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
    console.log("I am here in BaseTable getUser function");
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

  //this function will be used to create a new user
  addUser: function(req) {
    return new Promise(function(resolve,reject) {

      var params = {
          TableName: "BaseTable",
          Item: {
              "PK": 'user',
              "SK": uuid(),
              "first_name": req.body.first_name,
              "last_name": req.body.last_name,
              "email": req.body.email,
              "password": req.body.password
          }
      };

      //bcrypt the password and save the user in DB
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(params.Item.password, salt, (err, hash) => {
          if (err) 
            throw err;
          params.Item.password = hash;


          docClient.put(params, function(err, data) {
             if (err) {
                 resolve(err);
             } else {
                resolve(data);
             }
          });


        });
      });




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
              "name": req.body.name,
              "email_verifier": req.body.email_verifier,
              "contact_number": req.body.contact_number,
              "web_address": req.body.web_address,
              "address": req.body.address,
              "city": req.body.city,
              "state": req.body.state,
              "zip_code": req.body.zip_code
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
            "SK": req.body.edit_uuid
          },
          UpdateExpression: 'set #name = :new_name, #email_verifier = :new_email_verifier, #contact_number = :new_contact_number, #web_address = :new_web_address,  #address = :new_address, #city = :new_city, #state = :new_state, #zip_code = :new_zip_code',
          ExpressionAttributeValues: {
            ":new_name" : req.body.name,
            ":new_email_verifier" : req.body.email_verifier,
            ":new_contact_number" : req.body.contact_number,
            ":new_web_address" : req.body.web_address,
            ":new_address" : req.body.address,
            ":new_city" : req.body.city,
            ":new_state" : req.body.state,
            ":new_zip_code" : req.body.zip_code
          },
          ExpressionAttributeNames: {
            "#name": "name",
            "#email_verifier": "email_verifier",
            "#contact_number": "contact_number",
            "#web_address": "web_address",
            "#address": "address",
            "#city": "city",
            "#state": "state",
            "#zip_code": "zip_code"
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
              "name": req.body.name,
              "university_uuid": req.body.university_uuid,
              "code": req.body.code,
              "credit": req.body.credit,
              "from_time": req.body.from_time,
              "to_time": req.body.to_time
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
            "SK": req.body.edit_uuid
          },
          UpdateExpression: 'set #name = :new_name, #university_uuid = :new_university_uuid, #code = :new_code, #credit = :new_credit, #from_time = :new_from_time, #to_time = :new_to_time',
          ExpressionAttributeValues: {
            ":new_name" : req.body.name,
            ":new_university_uuid" : req.body.university_uuid,
            ":new_code": req.body.code,
            ":new_credit": req.body.credit,
            ":new_from_time": req.body.from_time,
            ":new_to_time": req.body.to_time
          },
          ExpressionAttributeNames: {
            "#name": "name",
            "#university_uuid": "university_uuid",
            "#code": "code",
            "#credit": "credit",
            "#from_time": "from_time",
            "#to_time": "to_time"
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
