import express from "express";
import userController from "../controller/userController";
import emailController from "../controller/EmailController";
let router = express.Router();

let initRouteUserAccount = (app) => {
  router.post("/api/login", userController.login);
  router.post("/api/register", userController.register);
  router.post("/api/resendOTP", userController.resendOTP);
  router.post("/api/forgotPassword", userController.forgotPassword);
  router.post("/api/updatePassword", userController.updatePassword);
  router.post(
    "/api/verifyforgotPasswordOTP",
    emailController.verifyforgotPasswordOTP
  );
  router.put("/api/changePassword", userController.changePassword);
  router.post("/api/verifyRegister", emailController.verifyRegister);
  router.post("/api/addPersonWord", userController.addPersonWord);
  router.delete("/api/deletePersonWord", userController.deletePersonWord);
  router.get("/api/checkExistPersonWord", userController.checkExistPersonWord);
  router.get("/api/listPersonWord", userController.listPersonWord);
  router.get("/api/test", userController.Test);
  router.get("/api/grammar", userController.Grammar);
  router.delete("/api/deleteTest", userController.DeleteTest);
  router.put("/api/updateScore", userController.UpdateScore);
  return app.use("/", router);
};

module.exports = initRouteUserAccount;
