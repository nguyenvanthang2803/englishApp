import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {
  if (req.originalUrl == "/api/refreshToken") {
    let tokenRefresh = jwt.sign(
      {
        token: generateRandomToken(),
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "10h",
      }
    );
    return res.status(200).json({
      tokenRefresh,
      errMessage: "Refesh token",
    });
  }
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
    if ((err.name = "TokenExpiredError")) {
      return res.status(200).json({
        errCode: 401,
        errMessage: err.message,
      });
    }
    return res.status(401).send(err);
  }
};
function generateRandomToken() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  var tokenLength = 32; // độ dài của token là 32
  for (var i = 0; i < tokenLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
module.exports = verifyToken;
