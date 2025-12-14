const Tip = require("../models/Tips");

// GET /api/tips
exports.getAllTips = async (req, res) => {
  try {
    const tips = await Tip.find()
      .sort({ createdAt: -1 })        // latest first
      .populate("user", "name email") // optional (safe fields only)
      .select("title content tags createdAt");

    res.status(200).json(tips);
  } catch (error) {
    console.error("Fetch tips error:", error);
    res.status(500).json({
      message: "Failed to fetch tips",
    });
  }
};

