"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        // queryInterface.changeColumn(
        //   "Words",
        //   "idTopic",
        //   {
        //     type: Sequelize.INTEGER,
        //     allowNull: false,
        //     references: {
        //       model: "Topics",
        //       key: "id",
        //       onDelete: "CASCADE",
        //     },
        //   },
        //   { transaction: t }
        // ),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([]);
    });
  },
};
