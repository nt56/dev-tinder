const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://nagutirth2121:qpKh3DDJE7o64njP@namastenode.f70ad.mongodb.net/DevTinder"
  );
};

module.exports = connectDB;
