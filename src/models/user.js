const mongoose = require("mongoose");
const validator = require("validator")

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
      validate: [(val)=>{
        return validator.isEmail(val)
      },'Invalid email']
    },
    password: {
      type: String,
      required: true,validate: [(val)=>{
        return validator.isStrongPassword(val)
      },'Enter a strong password']
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
