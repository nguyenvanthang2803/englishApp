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
      reject({ errCode: 0, errMessage: error });
    }
  });
};
let handleInfoUser = async (email) => {
  try {
    let user = await db.User.findOne({
      where: { email: email },
      attributes: [
        ["username", "username"],
        ["name", "name"],
        ["email", "email"],
        ["gender", "gender"],
        ["birthday", "birthday"],
        ["address", "address"],
        ["telephone", "telephone"],
        ["myrank", "myrank"],
      ],
      raw: true,
    });
    const date = new Date(user.birthday);
    user.birthday = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    user.gender = String(user.gender);
    let total = await db.User.findAndCountAll();
    user.totalUser = total.count;
    return {
      errCode: 0,
      errMessage: "Successfully",
      dataUser: user,
    };
  } catch (error) {
    return {
      errCode: 1,
      errMessage: error,
    };
  }
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
      reject({
        errCode: 0,
        errMessage: error,
      });
    }
  });
};
let handleSearchWord = async (data) => {
  if (!data) {
    const listWord = await db.Word.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    return {
      errCode: 0,
      errMessage: "Successfully ",
      listWord: listWord,
    };
  } else {
    const listWord = await db.Word.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        en: data,
      },
      raw: true,
    });
    if (Object.keys(listWord).length == 0) {
      return {
        errCode: 1,
        errMessage: "not exist ",
      };
    }
    listWord[0].idTopic = String(listWord[0].idTopic);
    listWord[0].id = String(listWord[0].id);
    return {
      errCode: 0,
      errMessage: "Successfully ",
      listWord: listWord,
    };
  }
};
let handleListTopic = async (req, res) => {
  try {
    if (Object.keys(req.query).length === 0) {
      const listTopic = await db.Topic.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: true,
      });
      return { errCode: 0, errMessage: "Successfully", list: listTopic };
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
        id: String(vocabulary["TopicVocabulary.id"]),
        en: vocabulary["TopicVocabulary.en"],
        vn: vocabulary["TopicVocabulary.vn"],
        type: vocabulary["TopicVocabulary.type"],
        IPA: vocabulary["TopicVocabulary.IPA"],
        example: vocabulary["TopicVocabulary.example"],
        image: vocabulary["TopicVocabulary.image"],
        audio: vocabulary["TopicVocabulary.audio"],
        idTopic: String(vocabulary["TopicVocabulary.idTopic"]),
      };
    });
    if (
      !vocabularyList[0].en &&
      !vocabularyList[0].vn &&
      !vocabularyList[0].type &&
      !vocabularyList[0].IPA &&
      !vocabularyList[0].example
    ) {
      return { errCode: 0, errMessage: "False", listWord: null };
    }
    return { errCode: 0, errMessage: "Successfully", listWord: vocabularyList };
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
      let checkWordExist = await db.Word.findOne({
        where: { en: en, IPA: IPA },
        raw: true,
      });
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
    let total = await db.User.findAndCountAll({ where: { roleId: 1 } });
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
      totalScore: 0,
      myrank: total.count + 1,
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
let handleDeleteWord = async (en) => {
  try {
    await db.Word.destroy({ where: { en: en } });
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
let handleDeleteTopic = async (topic) => {
  try {
    await db.Topic.destroy({ where: { topicName: topic } });
    return {
      errCode: 0,
      errMessage: "Delete Successfully",
    };
  } catch (error) {
    return {
      errCode: 1,
      errMessage: error,
    };
  }
};
let handleGetRankUser = async () => {
  try {
    let listUsers = await db.User.findAll({
      where: { roleId: 1 },
      order: [["myrank", "ASC"]],
      attributes: ["myrank", "username", "totalScore", "email"],
      raw: true,
    });

    return {
      errCode: 0,
      errMessage: "get successfully",
      listUsers: listUsers,
    };
  } catch (error) {
    return { errCode: 1, errMessage: error.message };
  }
};
const getStatisticalUser = async () => {
  let User50 = 0,
    User20 = 0,
    User100 = 0,
    UserNew = 0;
  let listUsers = await db.User.findAndCountAll({
    where: { roleId: 1 },
    attributes: ["id"],
    raw: true,
  });
  listUsers = listUsers.rows;
  const promises = listUsers.map(async (item, index) => {
    let countWord = await db.PersonWord.findAndCountAll({
      where: { idPerson: item.id },
      raw: true,
    });
    if (countWord.count >= 10) {
      User100 += 1;
    }
    if (countWord.count >= 5 && countWord.count < 10) {
      User50 += 1;
    }
    if (countWord.count >= 2 && countWord.count < 5) {
      User20 += 1;
    }
    if (countWord.count < 2) {
      UserNew += 1;
    }
  });

  await Promise.all(promises);
  return { User100, User50, User20, UserNew };
};
const getStatisticalTopic = async () => {
  let dataWord = [];
  let listTopic = await db.Topic.findAndCountAll({
    attributes: ["id"],
    raw: true,
  });
  listTopic = listTopic.rows;

  const promises = await listTopic.map(async (item) => {
    let countTopic = await db.PersonWord.findAndCountAll({
      include: [
        {
          model: db.Word,
          required: true,
          where: { idTopic: item.id },
        },
      ],
      raw: true,
    });
    let topicName = await db.Topic.findOne({
      where: { id: item.id },
      raw: true,
      attributes: ["topicName"],
    });
    topicName.count = countTopic.count;
    dataWord.push(topicName);
  });
  await Promise.all(promises);
  return dataWord;
};
let handleGetStatistical = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { User100, User50, User20, UserNew } = await getStatisticalUser();
      const dataWord = await getStatisticalTopic();
      resolve({
        errCode: 0,
        errMessage: "success",
        dataUser: [User100, User50, User20, UserNew],
        dataWord: dataWord,
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
  handleAddNewUser,
  handleDeleteUser,
  handleUpdateUser,
  handleDeleteWord,
  handleDeleteTopic,
  handleInfoUser,
  handleGetRankUser,
  handleGetStatistical,
};
