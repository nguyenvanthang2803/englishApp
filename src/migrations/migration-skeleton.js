"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        // queryInterface.addColumn("users", "roleId", { transaction: t }),
        // queryInterface.addColumn("users", "roleId", { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        // queryInterface.addColumn(
        //   "users",
        //   "isAdmin",
        //   { type: DataTypes.INTEGER },
        //   { transaction: t }
        // ),
      ]);
    });
  },
};
