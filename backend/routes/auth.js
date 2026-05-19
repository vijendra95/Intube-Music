const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Referral = require("../models/Referral");
const { generateToken, auth } = require("../middleware/auth");

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, referralCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const user = new User({ name, email, phone, password });
    await user.save();

    // Handle referral
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        user.referredBy = referrer._id;
        await user.save();
        await Referral.create({
          referrer: referrer._id,
          referred: user._id,
        });
      }
    }

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        referralCode: user.referralCode,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
