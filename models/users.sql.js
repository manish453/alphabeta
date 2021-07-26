'use strict';
module.exports = (sequelize, DataTypes) => {
	const users = sequelize.define('users', {
		user_id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: DataTypes.STRING,
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
				notEmpty: {
					msg: "Provide a Email Address"
				}
			}
		},
		salt: DataTypes.STRING(50),
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Provide a Password"
				}
			}
		},
		role: {
			type: DataTypes.ENUM,
			values: ["super", "admin"],
			defaultValue: "admin"
		},
		status: {
			type: DataTypes.INTEGER(1),
			defaultValue: 0
		},
		verification: DataTypes.STRING(50)
	}, {});
	users.associate = function (models) {
	};
	return users;
};