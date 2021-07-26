'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      name: "Manish",
      email: "manish@gmail.com",
      password: "caeb74fed18017f812cd16bbde861a",
      role: "super",
      salt: "ZwTVdNRhhp",
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
