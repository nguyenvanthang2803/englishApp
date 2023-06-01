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
let addPersonWordController = async (req, res) => {
  let MessageAddPersonWord = await userService.handleAddPersonWord(req.body);
  return res.status(200).json(MessageAddPersonWord);
};
let listPersonWordController = async (req, res) => {
  let MessageListPersonWord = await userService.handleListPersonWord(
    req.query.idPerson
  );
  return res.status(200).json(MessageListPersonWord);
};
let TestController = async (req, res) => {
  let MessageTest = await userService.handleTest(req.query);
  return res.status(200).json(MessageTest);
};
let GrammarController = async (req, res) => {
  let MessageGrammar = await userService.handleGrammar(req.query);
  return res.status(200).json(MessageGrammar);
};
let DeleteTestController = async (req, res) => {
  let messageDeleteTest = await userService.handleDeleteTest(req.body.name);
  return res.status(200).json(messageDeleteTest);
};
let EditTestController = async (req, res) => {
  let messageEditTest = await userService.handleEditTest(req);
  return res.status(200).json(messageEditTest);
};
module.exports = {
  loginController,
  registerController,
  forgotPasswordController,
  updatePasswordController,
  addPersonWordController,
  listPersonWordController,
  TestController,
  GrammarController,
  DeleteTestController,
  EditTestController,
};
