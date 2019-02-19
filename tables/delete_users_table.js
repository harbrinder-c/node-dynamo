var AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: "sdfdfsdf",
  secretAccessKey: "sdfsdf",
  region: "eu-west-2",
  endpoint: "http://localhost:8000"
});
var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "BaseTable"
};

dynamodb.deleteTable(params, function(err, data) {
    if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});