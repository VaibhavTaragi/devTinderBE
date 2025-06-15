const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditRequest } = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

//getMyProfile
profileRouter.get("/profile/myProfile", userAuth, (req, res) => {
  const loggedInUser = req.user;
  res.send(loggedInUser);
});

//edit profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isEditAllowed = validateEditRequest(req);
    if (!isEditAllowed) throw new Error("Invalid edit request");
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully.`,
      body: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//editPassword
profileRouter.patch("/profile/editPassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      throw new Error("Provide Current Password and New Password");
    const loggedInUser = req.user;
    const isPasswordValid = await loggedInUser.validatePassword(
      currentPassword
    );
    if(!isPasswordValid) throw new Error('Enter correct current password')
    const passwordHash = await bcrypt.hash(newPassword,10)
    loggedInUser.password = passwordHash
    loggedInUser.save()
    res.json({
        'message':`${loggedInUser.firstName} your password is changed successfully`,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
