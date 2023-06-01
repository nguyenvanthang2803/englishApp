"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Word extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Word.belongsTo(models.Topic, {
        foreignKey: "idTopic",
        targetKey: "id",
        as: "TopicVocabulary",
        onDelete: "CASCADE",
      });
      Word.hasMany(models.PersonWord, { foreignKey: "idWord" });
    }
  }
  Word.init(
    {
      en: DataTypes.STRING,
      vn: DataTypes.STRING,
      type: DataTypes.STRING,
      IPA: DataTypes.STRING,
      example: DataTypes.STRING,
      image: DataTypes.STRING,
      audio: DataTypes.STRING,
      idTopic: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Word",
    }
  );
  return Word;
};
