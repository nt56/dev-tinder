//dummy middleware where it checks admin auth if matches then execute else block otherwise send the error response

const adminAuth = (req, res, next) => {
  console.log("checking the admin auth middleware...");
  //dummy logic of matching the token
  const token = "nagabhushan";
  const isAdminAuth = token === "nagabhushan";
  if (!isAdminAuth) {
    res.status(401).send("Unauthorized Admin Request...!");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("checking the user auth middleware...");
  const token = "nagabhushan";
  const isUserAuth = token === "nagabhushan";
  if (!isUserAuth) {
    res.status(401).send("Unauthorized User Request...!");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
