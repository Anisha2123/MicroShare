// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tip: { type: mongoose.Schema.Types.ObjectId, ref: "Tip" },
  type: { type: String, default: "share" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
