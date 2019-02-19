var AWS = require("aws-sdk");
const bcrypt = require('bcryptjs');
const uuid = require('uuid/v1');


AWS.config.update({
  accessKeyId: "sdfdfsdf",
  secretAccessKey: "sdfsdf",
  region: "eu-west-2",
  endpoint: "http://localhost:8000"
});
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName : "BaseTable",
    KeySchema: [
        { AttributeName: "PK", KeyType: "HASH"}, //Partition key
        { AttributeName: 'SK', KeyType: 'RANGE' }   //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "PK", AttributeType: "S" },
        { AttributeName: "SK", AttributeType: "S" },
        { AttributeName: "email", AttributeType: "S" },
        { AttributeName: "university_uuid", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    GlobalSecondaryIndexes: [ 
        { 
            IndexName: 'GSI-Login', 
            KeySchema: [
                {
                    AttributeName: 'email',
                    KeyType: 'HASH',
                }
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        },
        { 
            IndexName: 'GSI-University-Courses', 
            KeySchema: [
                {
                    AttributeName: 'university_uuid',
                    KeyType: 'HASH',
                },
                { 
                    AttributeName: 'SK', 
                    KeyType: 'RANGE' 
                }
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        }
    ]
};


dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

// when table is created then add admin entry after 3 seconds
setTimeout(function(){
    //add admin entry to the DB
    var params = {
        TableName: "BaseTable",
        Item: {
            "PK": 'user',
            "SK": uuid(),
            "name": 'Admin User',
            "email": 'admin@gmail.com',
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
}, 3000);