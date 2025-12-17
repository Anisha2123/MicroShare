const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Tip = require("../models/Tips");
const User = require("../models/User");
const upload = require("../middleware/upload");

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
//   console.log("➡️ Suggested Users API HIT");
//   console.log("👤 Logged-in user ID:", req.user.id);

  const me = await User.findById(req.user.id)
    .populate("following", "_id name");

  if (!me) {
    // console.log("❌ Logged-in user not found");
    return res.status(404).json({ error: "User not found" });
  }

  const myFollowingIds = me.following.map(u => u._id.toString());

//   console.log("📌 I FOLLOW THESE USERS:", myFollowingIds);

  const users = await User.find({
    _id: { $ne: req.user.id },
  })
    .populate("following", "_id name")
    .populate("followers", "_id name");

//   console.log("👥 TOTAL USERS FOUND (excluding me):", users.length);

  const formatted = users.map(user => {
    const userId = user._id.toString();

    // console.log("\n---------------------------");
    // console.log("👤 Checking user:", user.name, userId);

    const theirFollowingIds = user.following.map(u => u._id.toString());
    const theirFollowerIds = user.followers.map(u => u._id.toString());

    // console.log("➡️ They FOLLOW:", theirFollowingIds);
    // console.log("⬅️ Their FOLLOWERS:", theirFollowerIds);

    const iAlreadyFollow = myFollowingIds.includes(userId);
    // console.log("❓ Do I already follow them?", iAlreadyFollow);

    const theyFollowMe = theirFollowingIds.includes(req.user.id);
    // console.log("❓ Do they follow ME?", theyFollowMe);

    const isFollowBack = theyFollowMe && !iAlreadyFollow;
    // console.log("🔥 FOLLOW BACK SHOULD SHOW?", isFollowBack);

    const mutual = user.followers.find(f =>
      myFollowingIds.includes(f._id.toString())
    );

    // console.log(
    //   "🤝 Mutual follower:",
    //   mutual ? mutual.name : "None"
    // );

    return {
      _id: user._id,
      name: user.name,
      username: user.username || user.name?.toLowerCase(),
      avatar: user.avatar || "",
      isFollowBack,
      mutualFollower: mutual ? mutual.name : null,
      iAlreadyFollow,
      theyFollowMe,
    };
  });

  // ❌ remove users I already follow
  const finalUsers = formatted.filter(u => !u.iAlreadyFollow);

//   console.log("\n✅ FINAL SUGGESTED USERS COUNT:", finalUsers.length);

  res.json(finalUsers);
});

// routes/user.js
router.get("/profile/:userId", auth, async (req, res) => {
    console.log(`profile api hit`)
  const user = await User.findById(req.params.userId)
    .select("-password")
    .populate("followers", "_id")
    .populate("following", "_id");

  const tipsCount = await Tip.countDocuments({ user: user._id });

  res.json({
    user,
    stats: {
      tips: tipsCount,
      followers: user.followers.length,
      following: user.following.length,
    },
  });
});

router.get("/profile/:userId/tips", auth, async (req, res) => {
  const tips = await Tip.find({ user: req.params.userId })
    .sort({ createdAt: -1 });

  res.json(tips);
});

router.post("/follow/:userId", auth, async (req, res) => {
  const target = await User.findById(req.params.userId);
  const me = await User.findById(req.user.id);

  const isFollowing = me.following.includes(target._id);

  if (isFollowing) {
    me.following.pull(target._id);
    target.followers.pull(me._id);
  } else {
    me.following.push(target._id);
    target.followers.push(me._id);
  }

  await me.save();
  await target.save();

  res.json({ following: !isFollowing });
});

router.get("/:userId/saved-tips", auth, async (req, res) => {
  try {
    console.log(`saved-tips api hit`)
    console.log(req.params.userId)
    const user = await User.findById(req.params.userId)
      .populate({
        path: "savedTips",
        populate: {
          path: "user",
          select: "name avatar"
        }
      })
      .select("savedTips");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.savedTips);
  } catch (err) {
    console.error("Saved tips error:", err);
    res.status(500).json({ message: "Failed to fetch saved tips" });
  }
});

// GET /api/users/:id/followers
router.get("/:id/followers", auth, async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("followers", "name avatar username")
    .select("followers");

  res.json(user.followers);
});

// GET /api/users/:id/following
router.get("/:id/following", auth, async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("following", "name avatar username")
    .select("following");

  res.json(user.following);
});

// POST /api/users/:id/unfollow
router.post("/:id/unfollow", auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { following: req.params.id },
  });

  await User.findByIdAndUpdate(req.params.id, {
    $pull: { followers: req.user.id },
  });

  res.json({ success: true });
});

// POST /api/users/:id/remove-follower
router.post("/:id/remove-follower", auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { followers: req.params.id },
  });

  await User.findByIdAndUpdate(req.params.id, {
    $pull: { following: req.user.id },
  });

  res.json({ success: true });
});

// PATCH /api/users/profile
router.patch("/profile", auth, async (req, res) => {
  const { bio } = req.body;
   console.log(` bio is ${bio}`);
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { bio },
    { new: true }
  );

  res.json(user);
});

// PATCH /api/users/avatar
const multer = require("multer");
// const path = require("path");
// const User = require("../models/User");
// const auth = require("../middleware/auth");

// ===== MULTER CONFIG =====
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// const upload = multer({ storage });

// ===== AVATAR API =====
router.patch(
  "/avatar",
  auth,
  upload.single("avatar"), // 🔥 MUST MATCH frontend key
  async (req, res) => {
    try {
      console.log("avatar api hit");

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // 🔥 STORE RELATIVE PATH
      user.avatar = `uploads/${req.file.filename}`;
      await user.save();

      res.json({ avatar: user.avatar });
    } catch (err) {
      console.error("Avatar upload error:", err);
      res.status(500).json({ message: "Avatar upload failed" });
    }
  }
);


module.exports = router;