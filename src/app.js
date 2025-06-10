const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

//signup api
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User saved successfully!");
  } catch (err) {
    res.status(400).send("Error saving user: " + err.message);
  }
});

//getUser by email api
app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user.length) {
      res.send(user);
    } else {
      res.status(400).send("User not found");
    }
  } catch (err) {
    res.status(400).send("Error saving user: " + err.message);
  }
});

//feed api - all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    users.length ? res.send(users) : res.status(400).send("No Users in DB");
  } catch (err) {
    res.status(400).send("Error saving user: " + err.message);
  }
});

//update user api
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const response = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
    });
    res.send(response);
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
