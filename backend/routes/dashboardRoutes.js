const express = require("express");
const Tip = require("../models/Tips");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/dashboard
 * Fetch user dashboard data
 */
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const tips = await Tip.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json({
      stats: {
        tipsCreated: tips.length,
        tipsSaved: 0, // future
      },
      tips,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
