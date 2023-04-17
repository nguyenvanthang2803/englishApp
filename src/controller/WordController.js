import WordService from "../service/WordService";
let handleSearchWord = async (req, res) => {
  let messageSearchWord = await WordService.searchWord(req.query.word);
  return res.status(200).json(messageSearchWord);
};
let handleListTopic = async (req, res) => {
  let messageListTopic = await WordService.listTopic(req);
  return res.status(200).json(messageListTopic);
};
module.exports = {
  handleSearchWord,
  handleListTopic,
};
