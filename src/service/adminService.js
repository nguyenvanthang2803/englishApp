import db from "../models";
let listUser = () => {
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

module.exports = {
  listUser,
};
