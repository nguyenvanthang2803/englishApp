import crypto from "crypto";
import db from "../models";
import EmailController from "../controller/EmailController";
import jwt from "jsonwebtoken";
import schedule from "node-schedule";
import bcrypt from "bcrypt";
let handleRegister = async (data) => {
  try {
    let { email } = data;
    let checkAccountIsExist = await db.User.findOne({
      where: { email: email },
    });
    let checkEmailVerify = await db.UserVerify.findOne({
      where: { email: email },
    });
    if (checkAccountIsExist || checkEmailVerify) {
      return {
        errCode: 1,
        errMessage: "Email already exists",
      };
    }

    const keyAES = Buffer.from(process.env.AES_KEY, "utf8").slice(0, 32);
    let encryptedData = crypto.createCipheriv(
      "aes-256-cbc",
      keyAES,
      Buffer.alloc(16)
    );
    let encryptedBuffer = Buffer.concat([
      encryptedData.update(JSON.stringify(data), "utf8"),
      encryptedData.final(),
    ]);

    // Chuỗi mã hóa dưới dạng base64
    const encryptedBase64 = encryptedBuffer.toString("base64");
    const token = jwt.sign(
      { userData: encryptedBase64 },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    createOTPandDestroy(email);
    return {
      errCode: 0,
      errMessage: "Check Verify Account",
      userData: {
        ...data,
        token,
      },
    };
  } catch (error) {
    return {
      errCode: 1,
      errMessage: error,
    };
  }
};
let createOTPandDestroy = async (email) => {
  const otp = createOTP();
  const createVerifyAccount = await db.UserVerify.create({
    email,
    otp,
    count: 3,
  });
  let scheduleDeleteCode = schedule.scheduleJob(
    Date.now() + 2 * 30 * 1000,
    async () => {
      await db.UserVerify.destroy({
        where: {
          email: email,
        },
      });
    }
  );
  //EmailController.SendEmailOTP(email, otp);
};
let createOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
let handleLogin = async (data) => {
  let { email, password } = data;
  let checkAccountLogin = await db.User.findOne({
    where: { email: email },
    raw: true,
    attributes: { exclude: ["createdAt", "updatedAt", "roleId"] },
    include: [
      {
        model: db.Role,
        as: "Role",
        attributes: ["role"],
        required: true,
      },
    ],
  });

  if (
    checkAccountLogin &&
    bcrypt.compareSync(password, checkAccountLogin.password)
  ) {
    checkAccountLogin.Role = checkAccountLogin["Role.role"];
    delete checkAccountLogin["Role.role"];
    delete checkAccountLogin["password"];
    const token = jwt.sign(
      {
        token: generateRandomToken(),
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );
    return {
      errCode: 0,
      errMessage: "Login Successfully",
      userData: {
        email: checkAccountLogin.email,
        Role: checkAccountLogin.Role,
      },
      token,
    };
  } else {
    return {
      errCode: 1,
      errMessage: "Email or Password wrong",
    };
  }
};
function generateRandomToken() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  var tokenLength = 32; // độ dài của token là 32
  for (var i = 0; i < tokenLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let handleForgotPassword = async (email) => {
  let checkAccountIsExist = await db.User.findOne({
    where: { email: email },
  });
  if (!checkAccountIsExist) {
    return {
      errCode: 1,
      errMessage: "Email not found",
    };
  }
  createOTPandDestroy(email);
  return {
    errCode: 0,
    errMessage: "Fill Code",
  };
};
let handleUpdatePassword = async (data) => {
  try {
    let { email, password } = data;
    let checkAccountIsExist = await db.User.findOne({
      where: { email: email },
    });
    if (!checkAccountIsExist) {
      return {
        errCode: 1,
        errMessage: "Email not found",
      };
    }
    password = hashPassword(password);
    await db.User.update({ password: password }, { where: { email: email } });
    return {
      errCode: 0,
      errMessage: "Password change successful",
    };
  } catch (error) {
    return {
      errCode: 0,
      errMessage: error,
    };
  }
};
let hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
let handleAddPersonWord = async (data) => {
  let { idPerson, idWord } = data;
  try {
    let checkWordExist = await db.PersonWord.findOne({
      where: { idPerson, idWord },
    });
    if (!checkWordExist) {
      await db.PersonWord.create({ idPerson, idWord });
      return {
        errCode: 0,
        errorMessage: "add person word successfully",
      };
    } else {
      return {
        errCode: 0,
        errorMessage: "Word is existed",
      };
    }
  } catch (error) {
    return {
      errCode: 0,
      errorMessage: "add person failed",
    };
  }
};
let handleListPersonWord = async (idPerson) => {
  try {
    let listPersonWord = await db.PersonWord.findAll({
      where: { idPerson: idPerson },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: db.Word,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    return listPersonWord;
  } catch (error) {
    return error;
  }
};
let handleTest = async (data) => {
  try {
    let { name, pageNumber } = data;
    let test;

    if (name == null) {
      test = await db.TypeTest.findAndCountAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: db.Test,
            attributes: ["name", "keyA", "keyB", "keyC", "keyD", "keyCorrect"],
          },
        ],
        limit: 10,
        offset: pageNumber * 10,
      });
      const testArr = test.rows.map((item) => {
        return item.Test;
      });

      return {
        errCode: 0,
        count: test.count,
        listTest: testArr,
      };
    } else if (name == "grammar") {
      test = await db.TypeTest.findAll({
        where: { name: { [db.Sequelize.Op.ne]: "Image" } },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: db.Test,
            attributes: ["name", "keyA", "keyB", "keyC", "keyD", "keyCorrect"],
          },
        ],
      });
    } else {
      test = await db.TypeTest.findAll({
        where: { name },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: db.Test,
            attributes: ["name", "keyA", "keyB", "keyC", "keyD", "keyCorrect"],
          },
        ],
      });
    }
    const testArr = test.map((item) => {
      return item.Test;
    });
    // Lấy ngẫu nhiên 10 phần tử từ mảng testArr
    const randomTestArr = testArr
      .sort(() => Math.random() - Math.random())
      .slice(0, 10);

    return {
      errCode: 0,
      listTest: randomTestArr,
    };
  } catch (error) {
    return {
      errCode: 1,
      errMessage: error,
    };
  }
};
let handleGrammar = async (data) => {
  try {
    let { name } = data;
    if (!name) {
      let allGrammar = await db.Grammar.findAll({
        attributes: ["name"],
      });
      return allGrammar;
    } else {
      let OnlyGrammar = await db.Grammar.findAll({
        where: { name: name },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      return OnlyGrammar;
    }
  } catch (error) {
    return error.message;
  }
};
let handleDeleteTest = async (name) => {
  try {
    await db.Test.destroy({ where: { name: name } });
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
let handleEditTest = async (req) => {
  let image;
  if (req.files.image) {
    let pathImage = req.files.image[0].path.replace(/\\/g, "/");
    image = pathImage.replace("src/public/", "");
  }
  let { keyA, keyB, keyC, keyD, keyCorrect, name } = req.body;
  let nameNew = req.body.nameNew;
  if (!nameNew) {
    nameNew = image;
  }
  if (!keyA || !keyB || !name || !keyC || !keyD || !keyCorrect) {
    return {
      errCode: 1,
      errMessage: "Missing parameters required",
    };
  }
  try {
    let updateTest = await db.Test.update(
      {
        name: nameNew,
        keyA: keyA,
        keyB: keyB,
        keyC: keyC,
        keyD: keyD,
        keyCorrect: keyCorrect,
      },
      { where: { name } }
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
  handleRegister,
  handleLogin,
  handleForgotPassword,
  handleUpdatePassword,
  handleAddPersonWord,
  handleListPersonWord,
  handleTest,
  handleGrammar,
  handleDeleteTest,
  handleEditTest,
};
