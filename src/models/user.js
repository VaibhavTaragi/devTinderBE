const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
      min: [18, "too young"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [
        (val) => {
          return validator.isEmail(val);
        },
        "Invalid email",
      ],
    },
    password: {
      type: String,
      required: true,
      validate: [
        (val) => {
          return validator.isStrongPassword(val);
        },
        "Enter a strong password",
      ],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "myClientSecret", {
    expiresIn: "7d",
  });
  return token
};

userSchema.methods.validatePassword = async function (userInputPassword){
  const user = this
  const passwordHash = user.password
  const isPasswordValid = await bcrypt.compare(userInputPassword,passwordHash)
  return isPasswordValid
}

module.exports = mongoose.model("User", userSchema);
