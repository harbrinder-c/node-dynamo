require('dotenv').config(); // this loads the defined variables from .env

const config = {
	db: {	   	   
	   accessKeyId: process.env.DB_ACCESS_KEY || '',
	   secretAccessKey: process.env.DB_SECRET || '',
	   region:process.env.REGION,
	   endpoint: process.env.DB_HOST_ENDPOINT || 'http://localhost:8000',
	},
	base_table : process.env.DB_Table || 'BaseTable'
};

module.exports = config;