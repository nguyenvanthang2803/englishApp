"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Test extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Test.belongsTo(models.TypeTest);
    }
  }
  Test.init(
    {
      name: DataTypes.STRING,
      keyA: DataTypes.STRING,
      keyB: DataTypes.STRING,
      keyC: DataTypes.STRING,
      keyD: DataTypes.STRING,
      keyCorrect: DataTypes.STRING,
      idTypeTest: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Test",
    }
  );
  return Test;
};
