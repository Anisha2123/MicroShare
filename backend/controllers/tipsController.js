const Tip = require("../models/Tips");

// GET /api/tips
exports.getAllTips = async (req, res) => {
  try {
    const tips = await Tip.find()
  .sort({ createdAt: -1 })
      .populate("user", "name")
      .populate("comments.user", "name")
      .populate("comments.replies.user", "name")
      .populate("emojis.user", "name")
      .select(
        "title content tags attachments createdAt user likes comments emojis"
      );

   tips.forEach(tip => {
  // console.log("ATTACHMENT:", tip.attachments);
});


    res.status(200).json(tips);
  } catch (error) {
    console.error("Fetch tips error:", error);
    res.status(500).json({
      message: "Failed to fetch tips",
    });
  }
};

