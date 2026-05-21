const express = require("express");
const chatRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const Message = require("../models/message");
const ConnectionRequest = require("../models/connectionRequest");

const areConnected = async (userId1, userId2) => {
  return !!(await ConnectionRequest.findOne({
    $or: [
      { fromUserId: userId1, toUserId: userId2, status: "accepted" },
      { fromUserId: userId2, toUserId: userId1, status: "accepted" },
    ],
  }));
};

chatRouter.get("/chat/messages/:userId", userAuth, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { userId } = req.params;

    if (!(await areConnected(currentUserId, userId))) {
      return res.status(403).send("You can only chat with your connections");
    }

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(100);

    res.json(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = { chatRouter, areConnected };
