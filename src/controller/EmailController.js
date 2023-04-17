import nodemailer from "nodemailer";
import emailService from "../service/EmailService";
require("dotenv").config();
let SendEmailOTP = async (email, OTP) => {
  console.log("Register");
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_MAILl, // generated ethereal user
        pass: process.env.USER_PASS, // generated ethereal password
      },
    });

    try {
      let info = await transporter.sendMail({
        from: "thang28032001@gmail.com", // sender address
        to: email, // list of receivers
        subject: "OTP", // Subject line
        html: `${OTP}`, // html body
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.error(error);
  }
};
let verifyRegisterController = async (req, res) => {
  let EmailMessageVerify = await emailService.handleEmailVerifyRegister(req);
  return res.status(200).json(EmailMessageVerify);
};
let verifyforgotPasswordOTPController = async (req, res) => {
  let EmailMessageVerify = await emailService.handleEmailVerifyRegister(req);
  return res.status(200).json(EmailMessageVerify);
};
module.exports = {
  SendEmailOTP,
  verifyRegisterController,
  verifyforgotPasswordOTPController,
};
