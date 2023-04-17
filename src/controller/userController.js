import userService from "../service/userService";
let loginController = async (req, res) => {
  let MessageLogin = await userService.handleLogin(req.body);
  return res.status(200).json(MessageLogin);
};
let registerController = async (req, res) => {
  let MessageRegister = await userService.handleRegister(req.body);
  return res.status(200).json(MessageRegister);
};
let forgotPasswordController = async (req, res) => {
  let MessageForgotPassword = await userService.handleForgotPassword(
    req.body.email
  );
  return res.status(200).json(MessageForgotPassword);
};
let updatePasswordController = async (req, res) => {
  let MessageUpdatePassword = await userService.handleUpdatePassword(req.body);
  return res.status(200).json(MessageUpdatePassword);
};
module.exports = {
  loginController,
  registerController,
  forgotPasswordController,
  updatePasswordController,
};
