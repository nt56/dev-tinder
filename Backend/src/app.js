const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.send("Home page of dev-tinder");
});

app.use("/test", (req, res) => {
  res.send("Testing the dev-tinder server");
});

app.use("/hello", (req, res) => {
  res.send("Hello from the dev-tinder server");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});
