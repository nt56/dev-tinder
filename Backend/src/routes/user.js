const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { connectionRequestModel } = require("../models/connectionRequest");
const User = require("../models/user");

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

//get all connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
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
      .populate("fromUserId", USER_DATA)
      .populate("toUserId", USER_DATA);

    //map- if request accepted fromUser or request accepted toUser both case handles returns what exists
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    //response back to the user
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

//feed
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //pagination
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    //find all the connection requests(sent+received)(2,3,4)
    const connectionRequest = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    //find the user to hide using set data structure
    const hideUsersFromFeed = new Set();
    connectionRequest.map((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    //find all the users whos id is not present in hideUser and not his own id(1)
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_DATA)
      .skip(skip)
      .limit(limit);

    //send back the response
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
module.exports = userRouter;
