const express = require("express");
const app = express();

//this will only handle GET call to the /user
app.get("/user", (req, res) => {
  res.send({ fistName: "nagabhushan", lastName: "tirth" });
});

app.post("/user", (req, res) => {
  //saving the data
  res.send("data saved to DB successfully");
});

app.patch("/user", (req, res) => {
  res.send("data updated from DB successfully");
});

app.delete("/user", (req, res) => {
  res.send("data deleted from DB successfully");
});

//this will match all the http methods api calls to /test
app.use("/test", (req, res) => {
  res.send("Testing the dev-tinder server-1");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});

//note-order of writing the routes matter a lot
