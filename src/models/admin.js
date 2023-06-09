"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Admin.belongsTo(models.Role, {
        foreignKey: "roleId",
        targetKey: "id",
        as: "Role",
      });
    }
  }
  Admin.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      gender: DataTypes.STRING,
      birthday: DataTypes.DATE,
      address: DataTypes.STRING,
      telephone: DataTypes.INTEGER,
      email: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Admin",
    }
  );
  return Admin;
};
