const mongoose = require("mongoose");

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
      maxLength: 50,
      // validate(value) {
      //   if (!validator.isEmail(value)) {
      //     throw new Error("Invalid email address: " + value);
      //   }
      // },
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
      trim: true,
      // validate(value) {
      //   if (!validator.isStrongPassword(value)) {
      //     throw new Error("Enter a Strong Password: " + value);
      //   }
      // },
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
      // validate() {
      //   if (!["male", "female", "other"]) {
      //     throw new Error("Enter correct gender");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      // validate(value) {
      //   if (!validator.isURL(value)) {
      //     throw new Error("Invalid Photo URL: " + value);
      //   }
      // },
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
