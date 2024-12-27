const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { connectionRequestModel } = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      //fetching toUserId, fromUserId, status
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      //validation - only allowed status
      const isStatusAllowed = ["ignored", "interested"];
      if (!isStatusAllowed.includes(status)) {
        throw new Error("Invalid status type " + status);
      }

      //checking toUser is valid or not
      const isValidToUser = await User.findById(toUserId);
      if (!isValidToUser) {
        throw new Error("user not found");
      }

      //check if there is existing connected user in DB or another user sending connection request to existing user
      const isExistingConnectionnectedUser =
        await connectionRequestModel.findOne({
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
          ],
        });
      if (isExistingConnectionnectedUser) {
        throw new Error("Connection request already exist..!");
      }

      //save the connection request and response back to the user
      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();

      res.send(
        `${req.user.firstName} your connection request sent to ${isValidToUser.firstName}`
      );
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

module.exports = requestRouter;
