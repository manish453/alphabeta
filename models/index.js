'use strict';

const fs = require("fs"),
	path = require("path"),
	Sequelize = require("sequelize"),
	basename = path.basename(__filename),
	conf = require("../config/configuration"),
	mysqlconf = require("../config/mysql")[conf.environment]

const db = {};

const options = {
	host: mysqlconf.host,
	dialect: mysqlconf.dialect,
	logging: (conf.environment === "production") ? false : console.log
}

let sequelize = new Sequelize(mysqlconf.database, mysqlconf.username, mysqlconf.password, options);

sequelize
	.authenticate()
	.then(() => {
		console.log("Connection has been established successfully.")
	})
	.catch(err => {
		console.error("Unable to connect to the database:", err)
	})

fs.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-7) === '.sql.js');
	})
	.forEach(file => {
		const model = sequelize['import'](path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;