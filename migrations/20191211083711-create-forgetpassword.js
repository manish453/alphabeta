'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('forgetpasswords', {
			email: {
				type: Sequelize.STRING,
				allowNull: false
			},
			verification: {
				type: Sequelize.STRING,
				primaryKey: true,
			},
			changefor: {
				type: Sequelize.STRING,
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('forgetpasswords');
	}
};