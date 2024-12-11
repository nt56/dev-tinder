const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

//post API call for creating user
app.post("/signup", async (req, res) => {
  //creting a dummy user
  const userObj = {
    firstName: "Roronoa",
    lastName: "Zoro",
    emailId: "zoro@gmail.com",
    password: "zoro@2002",
    age: 25,
    gender: "male",
  };
  //creting a new instance of user model
  const user = new User(userObj);

  //hnadling the wrror usinf try & catch
  try {
    await user.save(); //saving the data into DB
    res.send("User added to DB successfully....!"); //sending back the response
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
