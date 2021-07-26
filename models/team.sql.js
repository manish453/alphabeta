'use strict';
module.exports = (sequelize, DataTypes) => {
  const teams = sequelize.define('teams', {
    member_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    designation: DataTypes.STRING,
    social_links: DataTypes.TEXT,
    status: {
      type: DataTypes.INTEGER(1),
      defaultValue: 1
    }
  },{
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    });
  teams.associate = function(models) {
    // associations can be defined here
  };
  return teams;
};