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

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      //fetching the required data
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //validate the status
      const isValidStatus = ["accepted", "rejected"];
      if (!isValidStatus.includes(status)) {
        throw new Error("Invalid Status..!");
      }

      //validating data in DB where requestId=valid, loggedInUser=currentUserId, status="interested" - only loggedIn user and intrested status can review
      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        throw new Error("Connection Request Not found..!");
      }

      //loggedIn user modify the status and save
      connectionRequest.status = status;
      await connectionRequest.save();

      //send back the response
      res.send("Connection request reviewed...!");
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

module.exports = requestRouter;
