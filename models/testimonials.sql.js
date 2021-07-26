'use strict';
module.exports = (sequelize, DataTypes) => {
  const testimonials = sequelize.define('testimonials', {
    tstm_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tstm_name: DataTypes.STRING,
    tstm_img: DataTypes.STRING,
    tstm_body: DataTypes.TEXT,
    status: {
      type: DataTypes.INTEGER(1),
      defaultValue: 1
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });
  testimonials.associate = function (models) {
    // associations can be defined here
  };
  return testimonials;
};