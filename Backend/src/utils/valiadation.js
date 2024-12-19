const validator = require("validator");

const checkUserData = (req) => {
  //API validation - if user enter wrong data expect schema then it will throw an error it only includes allowedData
  const allowedData = [
    "firstName",
    "lastName",
    "emailId",
    "password",
    "gender",
    "age",
    "about",
    "photoUrl",
    "skills",
  ];
  const isDataAllowed = Object.keys(req.body).every((k) =>
    allowedData.includes(k)
  );
  if (!isDataAllowed) {
    throw new Error("Unnecessory Data is not allowed...!");
  }
};

const validateUserData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("some feilds must not be empty or Invalid data");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email ID is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong not valid");
  }
};

module.exports = { checkUserData, validateUserData };
