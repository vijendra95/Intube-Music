const express = require("express");
const router = express.Router();
const Referral = require("../models/Referral");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

// Get user's referral stats
router.get("/stats", auth, async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user._id }).populate(
      "referred",
      "name email plan createdAt"
    );

    const totalEarnings = referrals.reduce((sum, r) => sum + r.totalEarnings, 0);
    const activeSubscriptions = referrals.filter(
      (r) => r.status === "active"
    ).length;

    res.json({
      referralCode: req.user.referralCode,
      totalReferrals: referrals.length,
      activeSubscriptions,
      totalEarnings,
      referrals,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch referral stats." });
  }
});

module.exports = router;
