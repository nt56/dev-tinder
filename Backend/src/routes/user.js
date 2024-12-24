const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

module.exports = userRouter;
