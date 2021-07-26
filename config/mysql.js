let dirpath = __dirname + "/../"
require('dotenv-safe').config({
	path: dirpath + "myenv/.env",
	example: dirpath + ".env.example"
})

const config = {
	dialect: 'mysql',
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD
};

module.exports = {
	development: config,
	production: config
}
