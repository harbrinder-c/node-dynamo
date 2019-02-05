const express = require('express')
const app = express()
const port = 3000


var AWS= require('aws-sdk');
AWS.config.update({ accessKeyId: "myKeyId", secretAccessKey: "secretKey", region: "us-west-2" });
dyn= new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8000') });

dyn.listTables(function (err, data)
{
   console.log('listTables',err,data);
});

var documentClient = new AWS.DynamoDB.DocumentClient({ endpoint: new AWS.Endpoint('http://localhost:8000') });

var params = { TableName: "Users" };

documentClient.scan(params, onScan);
var count = 0;

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {        
        console.log("Scan succeeded.");
        data.Items.forEach(function(itemdata) {
           console.log("Item :", ++count,JSON.stringify(itemdata));
        });

        // continue scanning if we have more items
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}
// var AWS = require("aws-sdk");

// AWS.config.update({ accessKeyId: "myKeyId", secretAccessKey: "secretKey", region: "us-west-2" });

// var client = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8000') });
// var documentClient = new AWS.DynamoDB.DocumentClient({ endpoint: new AWS.Endpoint('http://localhost:8000') });

// var tableName = "Users";

// var params = {
//     TableName: tableName,
//     KeySchema: [
//         { AttributeName: "email", KeyType: "HASH"}  //Partition key
//         // { AttributeName: "title", KeyType: "RANGE" }  //Sort key
//     ],
//     AttributeDefinitions: [
//         { AttributeName: "email", AttributeType: "S" }
//         // { AttributeName: "title", AttributeType: "S" }
//     ],
//     ProvisionedThroughput: {
//         ReadCapacityUnits: 10,
//         WriteCapacityUnits: 10
//     }
// };

// client.createTable(params, function(tableErr, tableData) {
//     if (tableErr) {
//         console.error("Error JSON:", JSON.stringify(tableErr, null, 2));
//     } else {
//         console.log("Created table successfully!");
//     }

//     // Adding Batman movie to our collection
//     var params = {
//         TableName: tableName,
//         Item: {
//             "email": "abc@gmail.com",
//             "name": "User First",
//             "info": {
//                 "description": "This is the first user of the application.",
//                 "age": 30
//             }
//         }
//     };

//     console.log("Adding a new item...");
//     documentClient.put(params, function(err, data) {
//         if (err) {
//             console.error("Error JSON:", JSON.stringify(err, null, 2));
//         } else {
//             console.log("Added item successfully!");
//         }
//     });
// });

app.get('/', (req, res) => res.send('Welcome to Lessn!!'))

app.listen(port, () => console.log('Lessn is now running at port ${port}!'))