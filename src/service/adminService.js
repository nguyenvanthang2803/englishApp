import { response } from "express";
import bcrypt from "bcrypt";
import db from "../models";
let handleListUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let listUser = await db.User.findAll({
        attributes: [
          ["username", "username"],
          ["name", "name"],
          ["email", "email"],
          ["gender", "gender"],
          ["birthday", "birthday"],
          ["address", "address"],
          ["telephone", "telephone"],
        ],
        raw: true,
      });
      listUser.map((item, index) => {
        const date = new Date(item.birthday);
        item.birthday = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      });
      resolve({ errCode: 0, errMessage: "list User", listUser: listUser });
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
        raw: true,
      });
      return { errCode: 0, list: listTopic };
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
      raw: true,
    });
    let vocabularyList = ListVocabulary.map((vocabulary) => {
      return {
        id: vocabulary.id,
        en: vocabulary["TopicVocabulary.en"],
        vn: vocabulary["TopicVocabulary.vn"],
        type: vocabulary["TopicVocabulary.type"],
        IPA: vocabulary["TopicVocabulary.IPA"],
        example: vocabulary["TopicVocabulary.example"],
        image: vocabulary["TopicVocabulary.image"],
        audio: vocabulary["TopicVocabulary.audio"],
        idTopic: vocabulary["TopicVocabulary.idTopic"],
      };
    });
    return { errCode: 0, list: vocabularyList };
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
let handleAddNewUser = async (data) => {
  let { email, username, name, address, telephone, gender, birthday } = data;
  if (
    !email ||
    !username ||
    !name ||
    !address ||
    !telephone ||
    !gender ||
    !birthday ||
    !data.password
  ) {
    return {
      errCode: 1,
      errMessage: "Missing parameters required",
    };
  }
  let checkAccountIsExist = await db.User.findOne({
    where: { email: email },
  });
  if (checkAccountIsExist) {
    return {
      errCode: 1,
      errMessage: "Email is existed",
    };
  }
  let password = hashPassword(data.password);
  try {
    let createAccount = await db.User.create({
      email,
      password,
      username,
      name,
      address,
      telephone,
      roleId: 1,
      gender,
      birthday,
    });
    return {
      errCode: 0,
      errMessage: "Add Successfully",
    };
  } catch (error) {
    return {
      errCode: 1,
      errMessage: "Add failed",
    };
  }
};
let hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
let handleDeleteUser = async (email) => {
  try {
    await db.User.destroy({ where: { email: email } });
    return {
      errCode: 0,
      errMessage: "Delete Successfully",
    };
  } catch (error) {
    return {
      errCode: 0,
      errMessage: error,
    };
  }
};
let handleUpdateUser = async (data) => {
  let { email, username, name, address, telephone, gender, birthday } = data;
  if (
    !email ||
    !username ||
    !name ||
    !address ||
    !telephone ||
    !gender ||
    !birthday
  ) {
    return {
      errCode: 1,
      errMessage: "Missing parameters required",
    };
  }
  try {
    let updateUser = await db.User.update(
      {
        email: email,
        username: username,
        name: name,
        address: address,
        telephone: telephone,
        gender: gender,
        birthday: birthday,
      },
      { where: { email: email } }
    );
    return {
      errCode: 0,
      errMessage: "Update successful",
    };
  } catch (error) {
    return {
      errCode: 1,
      errMessage: "Update failed",
    };
  }
};
module.exports = {
  handleListUser,
  handleAddTopic,
  handleSearchWord,
  handleListTopic,
  handleAddNewWord,
  handleAddNewUser,
  handleDeleteUser,
  handleUpdateUser,
};
