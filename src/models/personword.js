"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PersonWord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PersonWord.belongsTo(models.User, { foreignKey: "idPerson" });
      PersonWord.belongsTo(models.Word, { foreignKey: "idWord" });
    }
  }
  PersonWord.init(
    {
      idPerson: DataTypes.INTEGER,
      idWord: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PersonWord",
    }
  );
  return PersonWord;
};
