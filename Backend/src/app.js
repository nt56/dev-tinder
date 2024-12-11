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
