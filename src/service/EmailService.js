import db from "../models";
import bcrypt from "bcrypt";
import crypto from "crypto";
let handleEmailVerifyRegister = async (req) => {
  // Tạo một đối tượng giải mã với thuật toán AES-256-CBC
  let data = req.body;
  const encryptedBuffer = Buffer.from(data.decoded.userData, "base64");
  const keyAES = Buffer.from(process.env.AES_KEY, "utf8").slice(0, 32);
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    keyAES,
    Buffer.alloc(16)
  );

  // Giải mã dữ liệu
  let decryptedBuffer = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);

  // Chuỗi dữ liệu sau khi giải mã
  const decryptedPlaintext = decryptedBuffer.toString("utf8");

  // Chuyển đổi chuỗi dữ liệu sau khi giải mã thành object JSON (nếu thích hợp)
  const dataDecrypt = JSON.parse(decryptedPlaintext);
  try {
    let email;
    let dataReturn = {};
    let { OTP } = data;
    if (data.email) {
      email = data.email;
    } else {
      email = dataDecrypt.email;
    }
    let checkOTP = await db.UserVerify.findOne({
      where: { email: email },
      raw: true,
    });

    if (!checkOTP || Date.now() - checkOTP.createdAt * 1000 > 2 * 30 * 1000) {
      return {
        errCode: 1,
        errMessage: "Please Register Again,Verify Code Expired",
      };
    }
    if (checkOTP.count >= 1) {
      await db.UserVerify.update(
        { count: checkOTP.count - 1 },
        {
          where: {
            count: checkOTP.count,
          },
        }
      );
      if (checkOTP.otp == OTP) {
        await db.UserVerify.destroy({
          where: {
            email: email,
          },
        });
        switch (req.originalUrl) {
          case "/api/verifyRegister": {
            let {
              email,
              username,
              name,
              address,
              telephone,
              gender,
              birthday,
            } = dataDecrypt;
            let password = hashPassword(dataDecrypt.password);
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
            {
              (dataReturn.errCode = 0),
                (dataReturn.errorMessage = "Register Successfully");
            }
            break;
          }
          case "/api/verifyforgotPasswordOTP": {
            {
              (dataReturn.errCode = 0),
                (dataReturn.errorMessage = "Fill New Password");
            }
            break;
          }
        }
      } else {
        {
          (dataReturn.errCode = 1),
            (dataReturn.errorMessage = "Verify Code Wrong");
        }
      }
      if (checkOTP.count == 1) {
        await db.UserVerify.destroy({
          where: {
            email: email,
          },
        });
        if (req.originalUrl == "/api/verifyforgotPasswordOTP") {
          await db.User.destroy({
            where: {
              email: email,
            },
          });

          return {
            errCode: 1,
            errMessage: "Verify Code Wrong, your account be deleted",
          };
        }
        {
          (dataReturn.errCode = 1),
            (dataReturn.errorMessage =
              "Verify Code Wrong, Please Excecute again");
        }
      }
    }
    return dataReturn;
  } catch (error) {
    return {
      errCode: 1,
      errorMessage: error,
    };
  }
};
let hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
module.exports = {
  handleEmailVerifyRegister,
};
