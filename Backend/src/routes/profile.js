const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditData } = require("../utils/valiadation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueName =
      req.user._id + "-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
    }
  },
});

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
    res.send(user);
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

profileRouter.post(
  "/profile/upload-photo",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        throw new Error("No file uploaded");
      }

      const photoUrl = "/uploads/" + req.file.filename;
      req.user.photoUrl = photoUrl;
      await req.user.save();

      res.send({ photoUrl });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  },
);

module.exports = profileRouter;
