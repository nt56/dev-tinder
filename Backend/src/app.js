const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

//it is json middleware which reads the data from request body and convert it into the json object
app.use(express.json());

app.post("/signup", async (req, res) => {
  const data = req.body;
  const user = await new User(data);

  try {
    await user.save();
    res.send("User added to DB successfully....!");
  } catch (err) {
    res.status(400).send("Error Adding the user....!" + err.message);
  }
});

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

//delete user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    // const user = await User.findByIdAndDelete({ _id: userId });
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.send("User Not found....!");
    } else {
      res.send("User deleted successfully....!");
    }
  } catch (err) {
    res.status(400).send("Something went Wrong....!" + err.message);
  }
});

//update user by id
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body; //data for update

  try {
    //API validation
    const allowedUpdates = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Unnecessory Update is not allowed...!");
    }
    if (data?.skills.length > 15) {
      throw new Error("Skills more than 15 is not allowed...!");
    }
    if (data?.age < 15) {
      throw new Error("Your age ahould be more than 15...!");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    if (!user) {
      res.send("user not found..!");
    } else {
      res.send("user updated successfully...!");
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
