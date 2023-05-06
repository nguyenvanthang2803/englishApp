'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      keyA: {
        type: Sequelize.STRING
      },
      keyB: {
        type: Sequelize.STRING
      },
      keyC: {
        type: Sequelize.STRING
      },
      keyD: {
        type: Sequelize.STRING
      },
      keyCorrect: {
        type: Sequelize.STRING
      },
      idTypeTest: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tests');
  }
};