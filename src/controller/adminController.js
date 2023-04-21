import adminService from "../service/adminService";
let ListUserController = async (req, res) => {
  let messageListUser = await adminService.handleListUser();
  return res.status(200).json(messageListUser);
};
let AddTopicController = async (req, res) => {
  let messageAddTopic = await adminService.handleAddTopic(req.body.topic);
  return res.status(200).json(messageAddTopic);
};
let AddNewWordController = async (req, res) => {
  let messageAddNewWord = await adminService.handleAddNewWord(req);
  return res.status(200).json(messageAddNewWord);
};
let SearchWordController = async (req, res) => {
  let messageSearchWord = await adminService.handleSearchWord(req.query.word);
  return res.status(200).json(messageSearchWord);
};
let ListTopicController = async (req, res) => {
  let messageListTopic = await adminService.handleListTopic(req);
  return res.status(200).json(messageListTopic);
};
module.exports = {
  ListUserController,
  SearchWordController,
  AddTopicController,
  AddNewWordController,
  ListTopicController,
};