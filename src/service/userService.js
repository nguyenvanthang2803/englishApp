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
  return Math.floor(Math.random() * 100) + 1;
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
    !checkAccountLogin ||
    bcrypt.compareSync(password, checkAccountLogin.password)
  ) {
    checkAccountLogin.Role = checkAccountLogin["Role.role"];
    delete checkAccountLogin["Role.role"];
    delete checkAccountLogin["password"];
    const token = jwt.sign(
      { userData: checkAccountLogin },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    return {
      errCode: 0,
      errMessage: "Login Successfully",
      userData: { checkAccountLogin, token },
    };
  } else {
    return {
      errCode: 1,
      errMessage: "Email or Password wrong",
    };
  }
};
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
module.exports = {
  handleRegister,
  handleLogin,
  handleForgotPassword,
  handleUpdatePassword,
  handleAddPersonWord,
  handleListPersonWord,
};
