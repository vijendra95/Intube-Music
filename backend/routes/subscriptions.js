const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const PLANS = {
  basic: {
    name: "Basic",
    price: 559,
    storage: 2 * 1024 * 1024 * 1024,
    quality: "720p",
    streamSlots: 1,
    platforms: ["youtube"],
  },
  popular: {
    name: "Popular",
    price: 699,
    storage: 5 * 1024 * 1024 * 1024,
    quality: "1080p",
    streamSlots: 1,
    platforms: ["youtube", "facebook"],
  },
  custom: {
    name: "Custom",
    basePrice: 399,
    storagePerGb: 50,
    additionalSlot: 199,
    quality: "1080p",
    platforms: ["youtube", "facebook", "twitch", "custom"],
  },
};

// Get available plans
router.get("/plans", (req, res) => {
  res.json({ plans: PLANS });
});

// Get user subscription
router.get("/current", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("plan planExpiry storage streamSlots");
    res.json({
      plan: user.plan,
      expiry: user.planExpiry,
      storage: user.storage,
      streamSlots: user.streamSlots,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get subscription info." });
  }
});

// Create subscription (alias for upgrade)
router.post("/create", auth, async (req, res) => {
  try {
    const { plan, duration = 1, durationUnit = "months" } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({ error: "Invalid plan selected." });
    }

    const planInfo = PLANS[plan];
    const basePrice = plan === "custom" ? planInfo.basePrice : planInfo.price;
    const amount = basePrice * duration;
    const gst = Math.round(amount * 0.18);
    const total = amount + gst;

    res.json({
      plan,
      amount: total * 100,
      gst,
      total,
      currency: "INR",
      orderId: `order_${Date.now()}`,
      razorpayKey: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
      message: "Order created. Proceed with payment.",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create subscription." });
  }
});

// Verify subscription payment
router.post("/verify", auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    // TODO: Verify Razorpay signature in production
    // For now, activate the plan
    const user = await User.findById(req.user._id);
    user.plan = req.body.plan || "popular";
    user.planExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();
    res.json({ message: "Subscription activated!", user });
  } catch (error) {
    res.status(500).json({ error: "Verification failed." });
  }
});

// Upgrade plan (creates Razorpay order)
router.post("/upgrade", auth, async (req, res) => {
  try {
    const { plan, duration = 1, durationUnit = "months" } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({ error: "Invalid plan selected." });
    }

    const planInfo = PLANS[plan];
    const basePrice = plan === "custom" ? planInfo.basePrice : planInfo.price;
    const amount = basePrice * duration;
    const gst = Math.round(amount * 0.18);
    const total = amount + gst;

    // TODO: Create Razorpay order
    res.json({
      plan,
      amount,
      gst,
      total,
      currency: "INR",
      orderId: `order_${Date.now()}`,
      message: "Order created. Proceed with payment.",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order." });
  }
});

module.exports = router;
