'use strict';
module.exports = (sequelize, DataTypes) => {
	const pages = sequelize.define('pages', {
		page_id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		slug: DataTypes.STRING,
		title: DataTypes.STRING,
		description: DataTypes.STRING,
		keyword: DataTypes.STRING,
		other_meta: DataTypes.TEXT('long'),
		ptitle: DataTypes.STRING,
		body: DataTypes.TEXT('long'),
		status: {
			type: DataTypes.INTEGER(1),
			defaultValue: 1
		}
	}, {
		charset: 'utf8',
		collate: 'utf8_unicode_ci'
	  });
	pages.associate = function (models) {
		
	};
	return pages;
};