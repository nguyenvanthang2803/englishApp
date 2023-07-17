import adminService from "../service/adminService";
let ListUser = async (req, res) => {
  let messageListUser = await adminService.handleListUser();
  return res.status(200).json(messageListUser);
};
let InfoUser = async (req, res) => {
  let messageInfoUser = await adminService.handleInfoUser(req.query.email);
  return res.status(200).json(messageInfoUser);
};

let AddTopic = async (req, res) => {
  let messageAddTopic = await adminService.handleAddTopic(req.body.topic);
  return res.status(200).json(messageAddTopic);
};
let AddNewWord = async (req, res) => {
  let messageAddNewWord = await adminService.handleAddNewWord(req);
  return res.status(200).json(messageAddNewWord);
};
let SearchWord = async (req, res) => {
  let messageSearchWord = await adminService.handleSearchWord(req.query.word);
  return res.status(200).json(messageSearchWord);
};
let ListTopic = async (req, res) => {
  let messageListTopic = await adminService.handleListTopic(req);

  return res.status(200).json(messageListTopic);
};
let AddNewUser = async (req, res) => {
  let messageAddNewUser = await adminService.handleAddNewUser(req.body);
  return res.status(200).json(messageAddNewUser);
};
let DeleteUser = async (req, res) => {
  let messageDeleteUser = await adminService.handleDeleteUser(req.body.email);
  return res.status(200).json(messageDeleteUser);
};
let UpdateUser = async (req, res) => {
  let messageUpdateUser = await adminService.handleUpdateUser(req.body);
  return res.status(200).json(messageUpdateUser);
};
let DeleteWord = async (req, res) => {
  let messageDeleteWord = await adminService.handleDeleteWord(req.body.en);
  return res.status(200).json(messageDeleteWord);
};
let DeleteTopic = async (req, res) => {
  let messageDeleteTopic = await adminService.handleDeleteTopic(req.body.topic);
  return res.status(200).json(messageDeleteTopic);
};
let getRankListUser = async (req, res) => {
  let messageGetRankUser = await adminService.handleGetRankUser();
  return res.status(200).json(messageGetRankUser);
};
let getStatistical = async (req, res) => {
  let messageGetStatistical = await adminService.handleGetStatistical();
  return res.status(200).json(messageGetStatistical);
};
let getListQuestion = async (req, res) => {
  let messageGetListQuestion = await adminService.handleGetListQuestion(
    req.query.typeTest
  );
  return res.status(200).json(messageGetListQuestion);
};
let getListTypeTest = async (req, res) => {
  let messageGetListTypeTest = await adminService.handleGetListTypeTest();
  return res.status(200).json(messageGetListTypeTest);
};
let addNewQuestion = async (req, res) => {
  let messageAddNewQuestion = await adminService.handleAddNewQuestion(req.body);
  return res.status(200).json(messageAddNewQuestion);
};
module.exports = {
  ListUser,
  SearchWord,
  AddTopic,
  AddNewWord,
  ListTopic,
  AddNewUser,
  DeleteUser,
  UpdateUser,
  DeleteWord,
  DeleteTopic,
  InfoUser,
  getRankListUser,
  getStatistical,
  getListQuestion,
  getListTypeTest,
  addNewQuestion,
};
