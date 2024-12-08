const express = require("express");
const app = express();

//multiple route handlers (below code snippet throes error after executing all the routes because of how js works bts)
app.use("/user", [
  (req, res, next) => {
    console.log("Handling the route user - 1");
    next();
    res.send("sending response of user - 1");
  },
  (req, res, next) => {
    console.log("Handling the route user - 2");
    next();
    res.send("sending response of user - 2");
  },
  (req, res, next) => {
    console.log("Handling the route user - 3");
    next();
    res.send("sending response of user - 3");
  },
  (req, res, next) => {
    console.log("Handling the route user - 4");
    next();
    res.send("sending response of user - 4");
  },
  (req, res, next) => {
    console.log("Handling the route user - 5");
    next();
    res.send("sending response of user - 5");
  },
  (req, res) => {
    console.log("Handling the route user - 6");
    res.send("sending response of user - 6");
  },
]);

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});

//note-order of writing the routes matter a lot
