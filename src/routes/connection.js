const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

//send request
requestRouter.post(
  "/request/send/:statusCode/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { statusCode, toUserId } = req.params;
      const fromUserId = req.user._id;
      const allowedStatusCodes = ["interested", "ignored"];
      if (!allowedStatusCodes.includes(statusCode)) {
        return res.status(400).send("Invalid status code");
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("Invalid request");
      }

      const requestAlreadyExist = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (requestAlreadyExist) {
        throw new Error("Request already exists");
      }

      const connectionRequestData = new ConnectionRequest({
        fromUserId,
        toUserId,
        status: statusCode,
      });

      const data = await connectionRequestData.save();
      res.json({
        message:
          statusCode === "interested"
            ? `${req.user.firstName} is interested in ${toUser.firstName}`
            : `${req.user.firstName} ignored ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

//review request
requestRouter.post(
  "/request/review/:statusCode/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { statusCode, requestId } = req.params;
      const loggedInUser = req.user;
      const allowedStatusCodes = ["accepted", "rejected"];
      if (!allowedStatusCodes.includes(statusCode)) {
        throw new Error("Inavlid status code " + statusCode);
      }
      const connectionRequestData = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequestData) {
        return res.status(404).send("Request not found!");
      }
      connectionRequestData.status = statusCode;
      const data = await connectionRequestData.save();
      res.json({ message: `Connecntion request ${statusCode}`, data });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
