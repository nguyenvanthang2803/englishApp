import express from "express";
import adminController from "../controller/adminController";
let router = express.Router();
import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      const dir = "src/public/images/";
      cb(null, dir);
    }
    if (file.fieldname === "audio") {
      const dir = "src/public/audios/";
      cb(null, dir);
    }
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage });
const cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);

let initRouteAdmin = (app) => {
  router.get("/api/listUser", adminController.ListUserController);
  router.post("/api/addTopic", adminController.AddTopicController);
  router.post(
    "/api/addNewWord",
    cpUpload,
    adminController.AddNewWordController
  );
  router.get("/api/searchWord", adminController.SearchWordController);
  router.get("/api/list-topic", adminController.ListTopicController);
  return app.use("/", router);
};

module.exports = initRouteAdmin;
