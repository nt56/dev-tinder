const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.send("Let's create Dev Tinder Web App....!");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});
