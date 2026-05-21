const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/user");
const { checkUserData, validateUserData } = require("../utils/valiadation");

const isProduction = process.env.NODE_ENV === "production" || !!process.env.RENDER;

const cookieOptions = {
  expires: new Date(Date.now() + 8 * 3600000),
  httpOnly: true,
  ...(isProduction && { sameSite: "None", secure: true }),
};

authRouter.post("/signup", async (req, res) => {
  try {
    //Validating the data
    checkUserData(req);
    validateUserData(req);

    //Encrypting the password
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      skills,
      about,
      photoUrl,
      gender,
    } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    //saving user in the DB
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      skills,
      gender,
      photoUrl,
      about,
    });

    const newUser = await user.save();

    const token = await newUser.getJWT();

    res.cookie("token", token, cookieOptions);
    res.setHeader("X-Auth-Token", token);

    res.status(200).send(newUser);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    //extracting email and password fro the body
    const { emailId, password } = req.body;

    //finding user by emailId and valiadting the emailId
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Crediantials");
    }

    //comparing the password and sending the response using schema methods
    const isPasswordMatch = await user.validatePassword(password);
    if (isPasswordMatch) {
      //create jwt token using schema methods
      const token = await user.getJWT();

      //token to the cookie send response back to the user
      res.cookie("token", token, cookieOptions);
      res.setHeader("X-Auth-Token", token);

      res.status(200).send(user);
    } else {
      throw new Error("Invalid Crediantials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    ...(isProduction && { sameSite: "None", secure: true }),
  });
  res.send("Logout Successful....!!");
});

authRouter.post("/forgot-password", async (req, res) => {
  try {
    const { emailId, newPassword } = req.body;

    if (!emailId || !newPassword) {
      throw new Error("Email and new password are required");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("No account found with this email");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error(
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol",
      );
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error("New password must be different from the old password");
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();

    res.send(
      "Password reset successfully! Please login with your new password.",
    );
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = authRouter;
