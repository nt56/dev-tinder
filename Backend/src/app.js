const express = require("express");
const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");
// app.use("/admin", adminAuth);
// app.use("/user", userAuth);

//we don't need auth in login
app.post("/admin/login", (req, res) => {
  res.status(200).send("Admin login successfully....!");
});

app.get("/admin/getAdminData", adminAuth, (req, res) => {
  res.status(200).send("All admin data sent successfully....!");
});

app.delete("/admin/deleteAdminData", adminAuth, (req, res) => {
  res.status(200).send("All admin data deleted successfully....!");
});

app.post("/user/login", (req, res) => {
  res.status(200).send("User login successfully....!");
});

app.get("/user/getUserData", userAuth, (req, res) => {
  res.status(200).send("All user data sent successfully....!");
});

app.delete("/user/deleteUserData", userAuth, (req, res) => {
  res.status(200).send("All user data deleted successfully....!");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});

//note-order of writing the routes matter a lot
