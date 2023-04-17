import adminService from "../service/adminService";
let handleListUser = async (req, res) => {
  let messageListUser = await adminService.listUser();
  return res.status(200).json(messageListUser);
};
module.exports = {
  handleListUser,
};
