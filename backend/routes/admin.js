const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Video = require("../models/Video");
const Stream = require("../models/Stream");
const Payment = require("../models/Payment");
const Referral = require("../models/Referral");
const Discount = require("../models/Discount");
const SiteSettings = require("../models/SiteSettings");
const { adminAuth } = require("../middleware/auth");
const fs = require("fs");

// All routes require admin auth
router.use(adminAuth);

// =============== STATS ===============

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeStreams = await Stream.countDocuments({ status: "live" });
    const totalVideos = await Video.countDocuments();
    const payments = await Payment.find({ status: "success" });
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });
    const activeSubscriptions = await User.countDocuments({ plan: { $ne: "free" } });

    const allVideos = await Video.find().select("size");
    const totalStorage = allVideos.reduce((sum, v) => sum + (v.size || 0), 0);
    const streamErrors = 0;

    res.json({
      totalUsers,
      activeStreams,
      totalRevenue,
      totalVideos,
      newUsersToday,
      activeSubscriptions,
      totalStorage,
      streamErrors,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});

// =============== USERS ===============

router.get("/users", async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const query = search
      ? { $or: [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
      : {};

    const users = await User.find(query)
      .select("-password")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    res.json({ users, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { name, plan, role, streamSlots, storageLimit, isActive } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (plan !== undefined) update.plan = plan;
    if (role !== undefined) update.role = role;
    if (streamSlots !== undefined) update.streamSlots = streamSlots;
    if (storageLimit !== undefined) update["storage.limit"] = storageLimit;
    if (isActive !== undefined) update.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user." });
  }
});

router.put("/users/:id/subscription", async (req, res) => {
  try {
    const { plan, streamSlots, storageLimit, daysToAdd } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    if (plan) user.plan = plan;
    if (streamSlots) user.streamSlots = streamSlots;
    if (storageLimit) user.storage.limit = storageLimit;
    if (daysToAdd) {
      const base = user.planExpiry && user.planExpiry > new Date() ? user.planExpiry : new Date();
      user.planExpiry = new Date(base.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    }

    await user.save();
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update subscription." });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    // Clean up user's videos
    const videos = await Video.find({ user: user._id });
    for (const v of videos) {
      if (v.path && fs.existsSync(v.path)) fs.unlinkSync(v.path);
    }
    await Video.deleteMany({ user: user._id });
    await Stream.deleteMany({ user: user._id });
    await Referral.deleteMany({ $or: [{ referrer: user._id }, { referred: user._id }] });
    await Payment.deleteMany({ user: user._id });
    await user.deleteOne();

    res.json({ message: "User and all associated data deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user." });
  }
});

// =============== STREAMS ===============

router.get("/streams", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { title: new RegExp(search, "i") };
    }
    const streams = await Stream.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ streams });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch streams." });
  }
});

router.post("/streams/:id/start", async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) return res.status(404).json({ error: "Stream not found." });
    stream.status = "live";
    stream.startedAt = new Date();
    await stream.save();
    res.json({ stream, message: "Stream started." });
  } catch (error) {
    res.status(500).json({ error: "Failed to start stream." });
  }
});

router.post("/streams/:id/stop", async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) return res.status(404).json({ error: "Stream not found." });
    stream.status = "idle";
    stream.stoppedAt = new Date();
    await stream.save();
    res.json({ stream, message: "Stream stopped." });
  } catch (error) {
    res.status(500).json({ error: "Failed to stop stream." });
  }
});

router.delete("/streams/:id", async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) return res.status(404).json({ error: "Stream not found." });
    await stream.deleteOne();
    res.json({ message: "Stream deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete stream." });
  }
});

// =============== VIDEOS ===============

router.get("/videos", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { $or: [{ title: new RegExp(search, "i") }, { originalName: new RegExp(search, "i") }] };
    }
    const videos = await Video.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ videos });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch videos." });
  }
});

router.delete("/videos/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found." });

    if (video.path && fs.existsSync(video.path)) fs.unlinkSync(video.path);

    const user = await User.findById(video.user);
    if (user) {
      user.storage.used = Math.max(0, user.storage.used - video.size);
      await user.save();
    }

    await video.deleteOne();
    res.json({ message: "Video deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete video." });
  }
});

// =============== PAYMENTS ===============

router.get("/payments", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { orderId: new RegExp(search, "i") };
    }
    const payments = await Payment.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments." });
  }
});

// =============== REFERRALS ===============

router.get("/referrals", async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate("referrer", "name email referralCode")
      .populate("referred", "name email")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ referrals });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch referrals." });
  }
});

// =============== DISCOUNTS ===============

router.get("/discounts", async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.json({ discounts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch discounts." });
  }
});

router.post("/discounts", async (req, res) => {
  try {
    const { code, discount, type, maxUses, expiresInDays } = req.body;
    if (!code || !discount) {
      return res.status(400).json({ error: "Code and discount amount are required." });
    }

    const existing = await Discount.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ error: "This code already exists." });
    }

    const discountDoc = new Discount({
      code: code.toUpperCase(),
      discount,
      type: type || "percent",
      maxUses: maxUses || 100,
      expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : null,
    });
    await discountDoc.save();
    res.status(201).json({ discount: discountDoc });
  } catch (error) {
    res.status(500).json({ error: "Failed to create discount." });
  }
});

router.put("/discounts/:id", async (req, res) => {
  try {
    const { isActive, discount, maxUses } = req.body;
    const update = {};
    if (isActive !== undefined) update.isActive = isActive;
    if (discount !== undefined) update.discount = discount;
    if (maxUses !== undefined) update.maxUses = maxUses;

    const doc = await Discount.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!doc) return res.status(404).json({ error: "Discount not found." });
    res.json({ discount: doc });
  } catch (error) {
    res.status(500).json({ error: "Failed to update discount." });
  }
});

router.delete("/discounts/:id", async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ message: "Discount deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete discount." });
  }
});

// =============== SETTINGS ===============

router.get("/settings", async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings." });
  }
});

router.put("/settings", async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ settings, message: "Settings saved." });
  } catch (error) {
    res.status(500).json({ error: "Failed to save settings." });
  }
});

module.exports = router;
