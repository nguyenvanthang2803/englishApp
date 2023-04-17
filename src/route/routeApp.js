import express from "express";
import WordController from "../controller/WordController";
let router = express.Router();

let initRouteApp = (app) => {
  router.get("/api/searchWord", WordController.handleSearchWord);
  router.get("/api/list-topic", WordController.handleListTopic);
  return app.use("/", router);
};

module.exports = initRouteApp;
