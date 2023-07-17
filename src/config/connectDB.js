import Sequelize from "sequelize";
require("dotenv").config();
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER_NAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DIALECT,
    logging: false,
  }
);
let connectDB = async () => {
  try {
    await sequelize.authenticate();
    //console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
export default connectDB;
