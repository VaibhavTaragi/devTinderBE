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

      if(requestAlreadyExist){
        throw new Error('Request already exists')
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

module.exports = requestRouter;
