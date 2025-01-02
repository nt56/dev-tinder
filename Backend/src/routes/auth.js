const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { checkUserData, validateUserData } = require("../utils/valiadation");

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
    await user.save();

    res.send("User added to DB successfully....!");
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
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.status(200).send(user);
    } else {
      throw new Error("Invalid Crediantials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successful....!!");
});

module.exports = authRouter;
