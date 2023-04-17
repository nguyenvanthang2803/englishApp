import db from "../models";
import bcrypt from "bcrypt";
let handleEmailVerifyRegister = async (req) => {
  try {
    let email;
    let data = req.body;
    let dataReturn = {};
    let { OTP } = data;
    if (data.email) {
      email = data.email;
    } else {
      email = data.decoded.userData.email;
    }
    let checkOTP = await db.UserVerify.findOne({
      where: { email: email },
      raw: true,
    });

    if (!checkOTP || Date.now() - checkOTP.createdAt * 1000 > 3 * 30 * 1000) {
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
            let { email, username, name, address, telephone } =
              data.decoded.userData;
            let password = hashPassword(data.decoded.userData.password);
            let createAccount = await db.User.create({
              email,
              password,
              username,
              name,
              address,
              telephone,
              roleId: 2,
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
