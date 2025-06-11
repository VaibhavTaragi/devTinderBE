const express = require("express");
const connectDB = require("./config/database");
const { validateSignUp } = require("./utils/validation");
const bcrypt = require("bcrypt");
const User = require("./models/user");

const app = express();

app.use(express.json());

//signup api
app.post("/signup", async (req, res) => {
  try {
    //Vaidate req data
    validateSignUp(req);

    const { firstName, lastName, email, password } = req.body;
    //Encrypt the password
    const hashedPass = await bcrypt.hash(password, 10);

    //Save the data
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPass,
    });
    if (req.body?.skills?.length > 10) {
      throw new Error("Skills can not be more than 10");
    }

    await user.save();
    res.send("User saved successfully!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
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
    const allowedToUpdate = ["age", "gender", "lastName", "password", "userId"];
    const isUpdateReqestedValid = Object.keys(req.body).every((i) =>
      allowedToUpdate.includes(i)
    );
    if (!isUpdateReqestedValid) {
      throw new Error("Invalid request");
    }
    if (req.body?.skills?.length > 10) {
      throw new Error("Skills can not be more than 10");
    }
    const response = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(response);
  } catch (err) {
    res.status(400).send("Error saving user: " + err.message);
  }
});

//update user with email
app.patch("/userByEmail", async (req, res) => {
  try {
    const allowedToUpdate = ["age", "gender", "lastName", "password", "userId"];
    const isUpdateReqestedValid = Object.keys(req.body).every((i) =>
      allowedToUpdate.includes(i)
    );
    if (!isUpdateReqestedValid) {
      throw new Error("Invalid request");
    }
    if (req.body?.skills?.length > 10) {
      throw new Error("Skills can not be more than 10");
    }
    const updated = await User.findOneAndUpdate(
      { email: req.body.email },
      req.body,
      { runValidators: true }
    );
    res.send(`User updated`);
  } catch (err) {
    res.status(400).send("Error saving user: " + err.message);
  }
});

//login api
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userInfo = await User.find({ email });
    if (!userInfo.length) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, userInfo[0].password);
    if(!isPasswordValid){
      throw new Error("Invalid Credentials");
    }
    res.send("Logged in successfully")
  } catch (err) {
    res.status(400).send("Error : " + err.message);
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
