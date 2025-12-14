const express = require("express");
const Tip = require("../models/Tips"); // assuming your model file is Tips.js
const authMiddleware = require("../middleware/auth");
const { getAllTips } = require("../controllers/tipsController");


const router = express.Router();

// Create new tip
router.post("/", authMiddleware, async (req, res) => {
    console.log(` create tip api hit`)
  try {
    const { title, content, tags } = req.body;
    console.log(req.body)
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newTip = await Tip.create({
      title,
      content,
      tags,
      user: req.user.id, // set by authMiddleware
    });

    res.status(201).json(newTip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/tips", getAllTips);

module.exports = router;
