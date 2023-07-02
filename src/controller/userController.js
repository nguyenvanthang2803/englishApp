import userService from "../service/userService";
let login = async (req, res) => {
  let MessageLogin = await userService.handleLogin(req.body);
  return res.status(200).json(MessageLogin);
};
let register = async (req, res) => {
  let MessageRegister = await userService.handleRegister(req.body);
  return res.status(200).json(MessageRegister);
};
let forgotPassword = async (req, res) => {
  let MessageForgotPassword = await userService.handleForgotPassword(
    req.body.email
  );
  return res.status(200).json(MessageForgotPassword);
};
let updatePassword = async (req, res) => {
  let MessageUpdatePassword = await userService.handleUpdatePassword(req.body);
  return res.status(200).json(MessageUpdatePassword);
};
let addPersonWord = async (req, res) => {
  let MessageAddPersonWord = await userService.handleAddPersonWord(req.body);
  return res.status(200).json(MessageAddPersonWord);
};
let listPersonWord = async (req, res) => {
  let MessageListPersonWord = await userService.handleListPersonWord(
    req.query.idPerson
  );
  return res.status(200).json(MessageListPersonWord);
};
let Test = async (req, res) => {
  let MessageTest = await userService.handleTest(req.query);
  return res.status(200).json(MessageTest);
};
let Grammar = async (req, res) => {
  let MessageGrammar = await userService.handleGrammar(req.query);
  return res.status(200).json(MessageGrammar);
};
let DeleteTest = async (req, res) => {
  let messageDeleteTest = await userService.handleDeleteTest(req.body.name);
  return res.status(200).json(messageDeleteTest);
};
let EditTest = async (req, res) => {
  let messageEditTest = await userService.handleEditTest(req);
  return res.status(200).json(messageEditTest);
};
let resendOTP = async (req, res) => {
  let messageResendOTP = await userService.handleResendOTP(req.body.email);
  return res.status(200).json(messageResendOTP);
};
let UpdateScore = async (req, res) => {
  let messageUpdateScore = await userService.handleUpdateScore(req.body);
  return res.status(200).json(messageUpdateScore);
};
let changePassword = async (req, res) => {
  let messageChangePassword = await userService.handleChangePassword(req.body);
  return res.status(200).json(messageChangePassword);
};
let deletePersonWord = async (req, res) => {
  let messageDeletePersonWord = await userService.handleDeletePersonWord(
    req.body
  );
  return res.status(200).json(messageDeletePersonWord);
};
let checkExistPersonWord = async (req, res) => {
  let messageCheckExistPersonWord =
    await userService.handleCheckExistPersonWord(req.query);
  return res.status(200).json(messageCheckExistPersonWord);
};
module.exports = {
  login,
  register,
  forgotPassword,
  updatePassword,
  addPersonWord,
  listPersonWord,
  Test,
  Grammar,
  DeleteTest,
  EditTest,
  resendOTP,
  UpdateScore,
  changePassword,
  deletePersonWord,
  checkExistPersonWord,
};
