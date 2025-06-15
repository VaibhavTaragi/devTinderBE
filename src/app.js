const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/connection");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(authRouter);
app.use(profileRouter);
app.use(requestRouter);

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
