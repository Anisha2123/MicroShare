const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Tip", tipSchema); // ✅ named export
