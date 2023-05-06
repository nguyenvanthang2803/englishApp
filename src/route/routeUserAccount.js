import express from "express";
import userController from "../controller/userController";
import emailController from "../controller/EmailController";
let router = express.Router();

let initRouteUserAccount = (app) => {
  router.post("/api/login", userController.loginController);
  router.post("/api/register", userController.registerController);
  router.post("/api/forgotPassword", userController.forgotPasswordController);
  router.post("/api/updatePassword", userController.updatePasswordController);
  router.post(
    "/api/verifyforgotPasswordOTP",
    emailController.verifyforgotPasswordOTPController
  );
  router.post("/api/verifyRegister", emailController.verifyRegisterController);
  router.post("/api/addPersonWord", userController.addPersonWordController);
  router.get("/api/listPersonWord", userController.listPersonWordController);
  router.get("/api/test", userController.TestController);
  router.get("/api/grammar", userController.GrammarController);
  return app.use("/", router);
};

module.exports = initRouteUserAccount;
