const mongoose = require("mongoose");

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
        return [...val].some((v)=>v==="@")
      },'Invalid email']
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
