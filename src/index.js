import express from "express";
import bodyParser from "body-parser";
import initRouteUserAccount from "./route/routeUserAccount";
import cors from "cors";
import initRouteAdmin from "./route/routeAdmin";
import connectDB from "./config/connectDB";
require("dotenv").config();
import auth from "./authentication/auth";
import path from "path";

let app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type,authorization"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(auth);

initRouteAdmin(app);
initRouteUserAccount(app);
connectDB();
let port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log("listening on port:" + `http://localhost:${port}`);
});
