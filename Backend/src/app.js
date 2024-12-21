const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { checkUserData, validateUserData } = require("./utils/valiadation");
const { userAuth } = require("./middlewares/auth");

app.use(express.json()); //it is json middleware which reads the data from request body and convert it into the json object
app.use(cookieParser()); //The cookie-parser module parses the Cookie header in a request and puts the cookie information in the req.cookies property

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

      res.send("Login Successfull....!");
    } else {
      throw new Error("Invalid Crediantials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sent the connection request...!");
});

connectDB()
  .then(() => {
    console.log("Database Connection Successfull....!");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.log("Database Connection UnSuccessfull....!");
  });
