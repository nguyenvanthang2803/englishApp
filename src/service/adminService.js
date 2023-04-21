import { response } from "express";
import db from "../models";
let handleListUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let listUser = await db.User.findAll();
      delete listUser.password;
      resolve(listUser);
    } catch (error) {
      reject(error);
    }
  });
};
let handleAddTopic = (topic) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Topic.create({ topicName: topic });
      resolve({
        errCode: 0,
        errMessage: "Add new Topic sucessfully ",
      });
    } catch (error) {
      reject(error);
    }
  });
};
let handleSearchWord = async (data) => {
  const listWord = await db.Word.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    where: {
      en: data,
    },
  });
  return listWord;
};
let handleListTopic = async (req, res) => {
  try {
    if (Object.keys(req.query).length === 0) {
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
let handleAddNewWord = (req) => {
  return new Promise(async (resolve, reject) => {
    let pathAudio = req.files.audio[0].path.replace(/\\/g, "/");
    let audio = pathAudio.replace("src/public/", "");
    let pathImage = req.files.image[0].path.replace(/\\/g, "/");
    let image = pathImage.replace("src/public/", "");
    let data = req.body;
    let { en, vn, type, IPA, idTopic, example } = data;
    try {
      let checkWordExist = db.Word.findAll({ where: { en: en, IPA: IPA } });
      if (!checkWordExist) {
        await db.Word.create({
          en,
          vn,
          type,
          IPA,
          idTopic,
          example,
          image,
          audio,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Word is existed",
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Add successfully ",
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  handleListUser,
  handleAddTopic,
  handleSearchWord,
  handleListTopic,
  handleAddNewWord,
};
