const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Video = require("../models/Video");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

// Upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/videos", req.user._id.toString());
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/quicktime", "video/avi", "video/webm", "video/x-msvideo"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only MP4, MOV, AVI, WebM files are allowed."), false);
    }
  },
});

// Get user videos
router.get("/", auth, async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ videos });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch videos." });
  }
});

// Upload video
router.post("/upload", auth, upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file provided." });
    }

    // Check storage limit
    const user = await User.findById(req.user._id);
    if (user.storage.used + req.file.size > user.storage.limit) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Storage limit exceeded." });
    }

    const video = new Video({
      user: req.user._id,
      title: req.body.title || req.file.originalname,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      status: "processing",
    });
    await video.save();

    // Update storage used
    user.storage.used += req.file.size;
    await user.save();

    res.status(201).json({ video });
  } catch (error) {
    res.status(500).json({ error: "Video upload failed." });
  }
});

// Delete video
router.delete("/:id", auth, async (req, res) => {
  try {
    const video = await Video.findOne({ _id: req.params.id, user: req.user._id });
    if (!video) {
      return res.status(404).json({ error: "Video not found." });
    }

    // Remove file
    if (fs.existsSync(video.path)) {
      fs.unlinkSync(video.path);
    }

    // Update storage
    const user = await User.findById(req.user._id);
    user.storage.used = Math.max(0, user.storage.used - video.size);
    await user.save();

    await video.deleteOne();
    res.json({ message: "Video deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete video." });
  }
});

module.exports = router;
