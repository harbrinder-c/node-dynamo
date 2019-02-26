var AWS = require("aws-sdk");
const bcrypt = require('bcryptjs');

// DB Config
const db = require('../config/config').db;

AWS.config.update(db);
var docClient = new AWS.DynamoDB.DocumentClient();



module.exports = {
  //this function will be used to create a new user
  createUser: function(req, res, next) {

    var params = {
        TableName: "Users",
        Item: {
            "id": 1,
            "name": 'User One',
            "email": 'abc@gmail.com',
            "password": 'test@123'
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
               console.error("Unable to add User", params.Item.name, ". Error JSON:", JSON.stringify(err, null, 2));
           } else {
               console.log("User succeeded:", params.Item.name);
           }
        });


      });
    });
  },

  //this function will be used to create a new user
  getUser: function(userId) {
    return new Promise(function(resolve,reject) {
      var params = {
          TableName: "Users",
          Key: {
              "id": userId
          }
      };

      docClient.get(params, function(err, data) {
      // if (err) {
      //     console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      // } else {
      //     console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
      // }
      // console.log(data);
      console.log('In promise');
        resolve(data);
        // callback(null,data)
      })
    });
  }
};
