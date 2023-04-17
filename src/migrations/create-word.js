"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Words", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      en: {
        type: Sequelize.STRING,
      },
      vn: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      IPA: {
        type: Sequelize.STRING,
      },
      idTopic: {
        type: Sequelize.STRING,
      },
      example: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      audio: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Words");
  },
};
