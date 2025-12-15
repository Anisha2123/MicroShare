const express = require("express");
const router = express.Router();
const Tip = require("../models/Tips");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getAllTips } = require("../controllers/tipsController");
const User = require("../models/User");

console.log("✅ tipsRoutes loaded");

// GET /api/tip?sort=latest|popular|trending&tag=react&page=1&limit=10
router.get("/", auth, async (req, res) => {
  try {
    const {
      sort = "latest",
      tag,
      page = 1,
      limit = 10,
    } = req.query;

    /* ---------- FILTER ---------- */
    const query = { visibility: "public" };

    if (tag) {
      query.tags = tag;
    }

    if (sort === "saved") {
      query.bookmarkedBy = req.user.id;
    }

    /* ---------- SORT ---------- */
    let sortOption = { createdAt: -1 };

    if (sort === "popular") {
      sortOption = { likesCount: -1 };
    }

    if (sort === "trending") {
      sortOption = { commentsCount: -1, likesCount: -1 };
    }

    /* ---------- PAGINATION ---------- */
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const tips = await Tip.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .populate("user", "name")
      .populate("comments.user", "name")
      .populate("comments.replies.user", "name");

    const total = await Tip.countDocuments(query);

    res.json({
      tips,
      hasMore: skip + tips.length < total,
      total,
      page: pageNumber,
    });
  } catch (err) {
    console.error("Fetch tips error:", err);
    res.status(500).json({
      message: "Failed to fetch tips",
    });
  }
});


// Create Tip route
router.post(
  "/",
  auth,
  upload.array("attachments", 5),
  async (req, res) => {
    try {
      const { title, content, visibility = "public" } = req.body;
      let { tags } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          message: "Title & content required",
        });
      }

      /* ---------- TAGS NORMALIZATION ---------- */
      let tagsArray = [];
      if (tags) {
        if (Array.isArray(tags)) {
          tagsArray = tags.map(tag => String(tag).trim());
        } else if (typeof tags === "string") {
          tagsArray = tags.split(",").map(tag => tag.trim());
        }
      }

      /* ---------- ATTACHMENTS ---------- */
      const attachments = req.files
        ? req.files.map(file => `/uploads/${file.filename}`)
        : [];

      /* ---------- CREATE TIP ---------- */
      const tip = await Tip.create({
        title,
        content,
        tags: tagsArray,
        attachments,           // ✅ ARRAY
        visibility,
        user: req.user.id,
      });

      res.status(201).json(tip);
    } catch (err) {
      console.error("Create tip error:", err);
      res.status(500).json({
        message: "Failed to create tip",
      });
    }
  }
);



module.exports = router;


router.get("/tips", getAllTips);


// Like / Unlike a Tip
router.post("/:id/like", auth, async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: "Tip not found" });

    const index = tip.likes.indexOf(req.user.id);
    if (index === -1) {
      tip.likes.push(req.user.id); // like
      tip.likesCount++;
    } else {
      tip.likes.splice(index, 1); // unlike
      tip.likesCount--;
    }
    await tip.save();
    res.json(tip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add Emoji Reaction
router.post("/:id/emoji", auth, async (req, res) => {
  try {
    const { emoji } = req.body;
    const tip = await Tip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: "Tip not found" });

    tip.emojis.push({ emoji, user: req.user.id });
    await tip.save();
    res.json(tip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add Comment
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const tip = await Tip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: "Tip not found" });

    tip.comments.push({ content, user: req.user.id });
    await tip.save();
    res.json(tip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Bookmark / Unbookmark
router.post("/:id/bookmark", auth, async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: "Tip not found" });

    const index = tip.bookmarks.indexOf(req.user.id);
    if (index === -1) {
      tip.bookmarks.push(req.user.id);
    } else {
      tip.bookmarks.splice(index, 1);
    }
    await tip.save();
    res.json(tip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// routes/tipsRoutes.js
router.post("/:id/share", auth, async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: "Tip not found" });

    tip.shareCount += 1;
    await tip.save();

    const shareUrl = `http://localhost:3000/tip/${tip._id}`;

    res.json({
      message: "Share link generated",
      url: shareUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Share failed" });
  }
});

router.post("/:id/forward", auth, async (req, res) => {
  const { receiverId } = req.body;

  if (!receiverId)
    return res.status(400).json({ message: "Receiver required" });

  const tip = await Tip.findById(req.params.id);
  if (!tip) return res.status(404).json({ message: "Tip not found" });

  await Notification.create({
    receiver: receiverId,
    sender: req.user.id,
    tip: tip._id,
  });

  tip.shareCount += 1;
  await tip.save();

  res.json({ message: "Tip forwarded successfully" });
});

// Reply to a comment
router.post("/:tipId/comment/:commentId/reply",
  auth,
  async (req, res) => {
    try {
      const { tipId, commentId } = req.params;
      const { content } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ message: "Reply content required" });
      }

      const tip = await Tip.findById(tipId);
      if (!tip) {
        return res.status(404).json({ message: "Tip not found" });
      }

      const comment = tip.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      comment.replies.push({
        user: req.user.id,
        content,
      });

      await tip.save();

      res.status(201).json({
        message: "Reply added",
        replies: comment.replies,
      });
    } catch (err) {
      console.error("Reply error:", err);
      res.status(500).json({ message: "Failed to add reply" });
    }
  }
);

// Add emoji reaction to comment
router.post("/:tipId/comment/:commentId/emoji",
  auth,
  async (req, res) => {
    try {
      const { tipId, commentId } = req.params;
      const { emoji } = req.body;

      if (!emoji) {
        return res.status(400).json({ message: "Emoji required" });
      }

      const tip = await Tip.findById(tipId);
      if (!tip) {
        return res.status(404).json({ message: "Tip not found" });
      }

      const comment = tip.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // 🔁 Toggle emoji per user
      const existing = comment.emojis.find(
        e =>
          e.user.toString() === req.user.id &&
          e.emoji === emoji
      );

      if (existing) {
        comment.emojis = comment.emojis.filter(
          e =>
            !(
              e.user.toString() === req.user.id &&
              e.emoji === emoji
            )
        );
      } else {
        comment.emojis.push({
          emoji,
          user: req.user.id,
        });
      }

      await tip.save();

      res.status(200).json({
        message: "Emoji updated",
        emojis: comment.emojis,
      });
    } catch (err) {
      console.error("Comment emoji error:", err);
      res.status(500).json({ message: "Failed to react" });
    }
  }
);

router.get("/trending/tags", auth, async (req, res) => {
  const { range = "daily" } = req.query;

  const days = range === "weekly" ? 7 : 1;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const tags = await Tip.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $unwind: "$tags" },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);

  // Mock AI tags (later replace with ML service)
  const enriched = tags.map((t, i) => ({
    ...t,
    ai: i < 2, // top 2 marked as AI
  }));

  res.json(enriched);
});


router.get("/popular", async (req, res) => {
  try {
    console.log("🔥 popular api hit");

    const tips = await Tip.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ["$likes", []] } },
          commentsCount: { $size: { $ifNull: ["$comments", []] } },
        },
      },
      {
        $sort: {
          likesCount: -1,
          commentsCount: -1,
        },
      },
      { $limit: 5 },
      {
        $project: {
          title: 1,
          likesCount: 1,
          commentsCount: 1,
        },
      },
    ]);

    res.json(tips);
  } catch (err) {
    console.error("Popular tips error:", err);
    res.status(500).json([]);
  }
});


router.get("/saved/mini", auth, async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate("savedTips", "title");

  res.json(user.savedTips.slice(0, 5));
});


module.exports = router;
