const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //read token from the request cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }

    //validate the token
    const isValidToken = await jwt.verify(token, process.env.JWT_SECRET);

    //find the user
    const { _id } = isValidToken;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found...!");
    }

    //store user to req and next()
    req.user = user;
    next(); //if no error then goes to the next
  } catch (err) {
    res.status(404).send("Error : " + err.message);
  }
};

module.exports = { userAuth };
