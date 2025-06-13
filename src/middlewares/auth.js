const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid Token!!");
    const decodedObj = await jwt.verify(token, "myClientSecret");
    const { _id } = decodedObj;
    if (!_id) throw new Error("Invalid Token!!");
    const userObj = await User.findById(_id);
    if (!userObj) throw new Error("Invalid Token!!");
    req.user = userObj;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { userAuth };
