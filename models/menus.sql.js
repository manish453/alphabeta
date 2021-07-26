'use strict';
module.exports = (sequelize, DataTypes) => {
  const menus = sequelize.define('menus', {
    menu_id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: DataTypes.STRING,
		url: DataTypes.STRING,
		order_number: DataTypes.INTEGER(4),
		status: {
			type: DataTypes.INTEGER(1),
			defaultValue: 1
		}
  }, {});
  menus.associate = function(models) {
    // associations can be defined here
  };
  return menus;
};