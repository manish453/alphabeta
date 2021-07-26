'use strict';
module.exports = (sequelize, DataTypes) => {
  const homepage = sequelize.define('homepage', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    section_id: DataTypes.STRING,
    title: DataTypes.STRING,
    body: DataTypes.TEXT('long'),
    sec_background: DataTypes.STRING,
    order_number: DataTypes.INTEGER(4),
    status: {
      type: DataTypes.INTEGER(1),
      defaultValue: 1
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    freezeTableName: true,
    underscored: true
  });
  homepage.associate = function (models) {
    // associations can be defined here
  };
  return homepage;
};