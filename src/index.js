import express from "express";
import bodyParser from "body-parser";
import initRouteUserAccount from "./route/routeUserAccount";

import initRouteAdmin from "./route/routeAdmin";
import connectDB from "./config/connectDB";
require("dotenv").config();
import auth from "./authentication/auth";
import path from "path";

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auth);
app.use(express.static(path.join(__dirname, "public")));
initRouteAdmin(app);
initRouteUserAccount(app);
connectDB();
let port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log("listening on port:" + `http://localhost:${port}`);
});
