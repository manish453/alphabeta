'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('homepage', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      section_id:Sequelize.STRING,
      title: Sequelize.STRING,
      body: Sequelize.TEXT('long'),
      sec_background: Sequelize.STRING,
      order_number: Sequelize.INTEGER(4),
      status: {
        type: Sequelize.INTEGER(1),
        defaultValue: 1
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },{
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
      freezeTableName: true,
			underscored: true
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('homepage');
  }
};