const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");

const app = express();

connectDB()
  .then(() => {
    console.log("DB connection successfull");
    app.listen(4000, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.error("Connection to DB failed");
  });
