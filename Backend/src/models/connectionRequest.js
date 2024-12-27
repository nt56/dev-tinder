const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        methods: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

//creating index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//toUser and fromUser cannot be same - it is handles in connectionRequest Schema
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("connot send connection request to yourself...!");
  }
  next();
});

const connectionRequestModel = new mongoose.model(
  "connectionRequestModel",
  connectionRequestSchema
);
module.exports = { connectionRequestModel };
