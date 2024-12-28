const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { connectionRequestModel } = require("../models/connectionRequest");

const USER_DATA = "firstName lastName age gender skills about";

//get all the pending  connection request for loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //query to find and populate - returns array of lists with every fromUserId info
    const connectionRequest = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_DATA);

    //map only fromUser data
    const data = connectionRequest.map((row) => row.fromUserId);

    //send back the response
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //status should be "accepted" && toUser-fromUser can be same then connection made
    //either fromUserId accepted or toUserId should accepted the request
    //populate
    const connectionRequest = await connectionRequestModel
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_DATA);

    //map only fromUser data
    const data = connectionRequest.map((row) => row.fromUserId);

    //response back to the user
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = userRouter;
