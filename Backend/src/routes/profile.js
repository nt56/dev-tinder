const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditData } = require("../utils/valiadation");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Invalid Edit request...!");
    }

    const user = req.user; //user from cookie
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key])); //upadating feilds with req.body

    await user.save();
    res.send(`${user.firstName}, your profile updated successfuly...!`);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { password } = req.body;

    if (password === user.password) {
      throw new Error("New Password and Old Passwors must be different...!");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error("Enter a Strong Password");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await user.save();

    res.send(`${user.firstName}, your password updated successfuly...!`);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = profileRouter;
