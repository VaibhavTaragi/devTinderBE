const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Virat",
    lastName: "Kohli",
    email: "virat@gmail.com",
    password: "virat@123",
  });

  try {
    user.save();
    res.send("User saved successfully!");
  } catch (err) {
    res.status(400).send("Error saving user: " + err.message);
  }
});

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
