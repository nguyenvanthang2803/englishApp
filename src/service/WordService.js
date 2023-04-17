import Op from "sequelize";
import db from "../models";
let searchWord = async (data) => {
  const listWord = await db.Word.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    where: {
      en: data,
    },
  });
  return listWord;
};
let listTopic = async (req, res) => {
  try {
    if (req.query === {}) {
      const listTopic = await db.Topic.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      return listTopic;
    }
    let topic = req.query.topic;
    let ListVocabulary = await db.Topic.findAll({
      where: { topicName: topic },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: db.Word,
          as: "TopicVocabulary",
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    return ListVocabulary;
  } catch (error) {
    return error;
  }
};

module.exports = {
  searchWord,
  listTopic,
};
