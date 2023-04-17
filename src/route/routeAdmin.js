import express from "express";
import adminController from "../controller/adminController";
let router = express.Router();

let initRouteAdmin = (app) => {
  router.get("/api/listUser", adminController.handleListUser);
  return app.use("/", router);
};

module.exports = initRouteAdmin;
