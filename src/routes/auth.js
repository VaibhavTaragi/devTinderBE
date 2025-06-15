const express = require("express");
const User = require("../models/user");
const { validateSignUp } = require("../utils/validation");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

//signup api
authRouter.post("/signup", async (req, res) => {
  try {
    //Vaidate req data
    validateSignUp(req);

    const { firstName, lastName, email, password, skills } = req.body;
    //Encrypt the password
    const hashedPass = await bcrypt.hash(password, 10);

    //Save the data
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPass,
      skills,
    });
    await user.save();
    res.send("User saved successfully!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userInfo = await User.find({ email });
    if (!userInfo.length) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await userInfo[0].validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }
    const token = await userInfo[0].getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
    });
    res.send("Logged in successfully");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

//logout api
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token").send("User logged out successfully");
});

module.exports = authRouter;
