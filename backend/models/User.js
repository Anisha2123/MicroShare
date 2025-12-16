const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likedTips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tip" }],
  savedTips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tip" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  bio: {
      type: String,
      default: "",
      maxlength: 200,
    },

    avatar: {
      type: String, // image URL
      default: "",
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
