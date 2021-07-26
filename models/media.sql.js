'use strict';
module.exports = (sequelize, DataTypes) => {
  const media = sequelize.define('media', {
    img_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    image: DataTypes.STRING,
    thumb:  DataTypes.STRING,
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  media.associate = function (models) {
    // associations can be defined here
  };
  return media;
};