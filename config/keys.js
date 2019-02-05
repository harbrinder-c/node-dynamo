dbPassword = 'mongodb://localhost:27017/mydb';
dynamoKeys = {
				  accessKeyId: "sdfdfsdf",
				  secretAccessKey: "sdfsdf",
				  region: "eu-west-2",
				  endpoint: "http://localhost:8000"
			 };

module.exports = {
    mongoURI: dbPassword,
    dynamoKeys: dynamoKeys
};