const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

//it is json middleware which reads the data from request body and convert it into the json object
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added to DB successfully....!");
  } catch (err) {
    res.status(400).send("Error Adding the user....!" + err.message);
  }
});

//get user by emailId
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;

//   try {
//     const user = await User.find({ emailId: userEmail });
//     if (!user) {
//       res.send("User not found");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send("Something went Wrong....!" + err.message);
//   }
// });

//get user by Id
app.get("/user", async (req, res) => {
  const userId = req.body._id;

  try {
    const user = await User.find({ _id: userId });
    if (!user) {
      res.send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went Wrong....!" + err.message);
  }
});

//get all users from DB
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if ((await users).length === 0) {
      res.send("No users found in the DB...!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went Wrong....!" + err.message);
  }
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
