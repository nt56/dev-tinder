const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
      trim: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      required: true,
      maxLength: 30,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      maxLength: 100,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 15,
    },
    gender: {
      type: String,
      trim: true,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    skills: {
      type: [String],
      lowercase: true,
      maxLength: 15,
    },
    about: {
      type: String,
      maxLength: 100,
      default: "This is a default about of the user!",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
