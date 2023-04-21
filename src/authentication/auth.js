import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {
  if (
    req.originalUrl == "/api/login" ||
    req.originalUrl == "/api/register" ||
    req.originalUrl == "/api/forgotPassword" ||
    req.originalUrl == "/api/verifyforgotPasswordOTP" ||
    req.originalUrl == "/api/updatePassword"
  ) {
    return next();
  }
  if (!req.headers.authorization) {
    return res.status(403).send("A token is required for authentication");
  }
  let tokenReq = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(tokenReq, process.env.TOKEN_KEY);
    if (req.originalUrl == "/api/verifyRegister") {
      req.body = { ...req.body, decoded };
    }
    next();
  } catch (err) {
    return res.status(401).send(err);
  }
};
module.exports = verifyToken;
