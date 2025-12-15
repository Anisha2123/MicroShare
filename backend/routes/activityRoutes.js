


const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Activity = require("../models/Activity");
router.get("/", auth, async (req, res) => {
  const activity = await Activity.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("actor", "name")
    .populate("tip", "title");

  res.json(activity);
});

module.exports = router;