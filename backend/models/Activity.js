

const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // receiver
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who did action
  tip: { type: mongoose.Schema.Types.ObjectId, ref: "Tip" },
  type: {
    type: String,
    enum: ["like", "comment", "reply", "save"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Activity", activitySchema);
