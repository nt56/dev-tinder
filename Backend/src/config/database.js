const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DB_STRING);
};

module.exports = connectDB;
