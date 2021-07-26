'use strict';
module.exports = (sequelize, DataTypes) => {
	const forgetpassword = sequelize.define('forgetpassword', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isEmail: true,
				notEmpty: {
					msg: "Provide a Email Address"
				}
			}
		},
		verification: {
			type: DataTypes.STRING,
			primaryKey: true,
			validate: {
				notEmpty: true
			}
		},
		changefor: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {});
	forgetpassword.associate = function (models) {
		// associations can be defined here
	};
	return forgetpassword;
};