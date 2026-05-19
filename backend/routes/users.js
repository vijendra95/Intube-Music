const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { auth, adminAuth } = require("../middleware/auth");

// Update profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    ).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile." });
  }
});

// Update billing details
router.put("/billing", auth, async (req, res) => {
  try {
    const { company, gst, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { billingDetails: { company, gst, address } },
      { new: true }
    ).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update billing details." });
  }
});

// Change password
router.put("/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to change password." });
  }
});

// Dashboard stats
router.get("/dashboard", auth, async (req, res) => {
  try {
    const Video = require("../models/Video");
    const Stream = require("../models/Stream");

    const videos = await Video.countDocuments({ user: req.user._id });
    const activeStreams = await Stream.countDocuments({ user: req.user._id, status: "live" });
    const videosDocs = await Video.find({ user: req.user._id }).select("size");
    const storageUsed = videosDocs.reduce((sum, v) => sum + (v.size || 0), 0);
    const streamSlots = req.user.streamSlots || 1;

    res.json({ videos, activeStreams, storageUsed, streamSlots });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard stats." });
  }
});

// Admin: Get all users
router.get("/", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = search
      ? { $or: [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
      : {};

    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    res.json({ users, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

module.exports = router;
