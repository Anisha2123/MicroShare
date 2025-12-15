const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Tip = require("../models/Tips");
const User = require("../models/User");

// Get user stats

router.get("/me/stats", auth, async (req, res) => {
  try {
    const tipsCount = await Tip.countDocuments({ user: req.user.id });

    const bookmarksCount = await Tip.countDocuments({
      bookmarks: req.user.id,
    });

    res.json({
      name: req.user.name,
      email: req.user.email,
      tipsCount,
      bookmarksCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
});

router.get("/suggested", auth, async (req, res) => {
    console.log(`suggested user ai hit`)
  const users = await User.find({ _id: { $ne: req.user.id } })
    .limit(5)
    .select("name");

  res.json(users);
});

router.post("/:id/follow", auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $addToSet: { following: req.params.id },
  });

  await User.findByIdAndUpdate(req.params.id, {
    $addToSet: { followers: req.user.id },
  });

  res.json({ success: true });
});


module.exports = router;