const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const { auth } = require("../middleware/auth");

// Get user's payment history
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = { user: req.user._id };
    if (status && status !== "all") {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(query);

    res.json({ payments, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments." });
  }
});

// Verify payment (Razorpay webhook)
router.post("/verify", auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    // TODO: Verify with Razorpay SDK
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ error: "Order not found." });
    }

    payment.paymentId = paymentId;
    payment.razorpaySignature = signature;
    payment.status = "success";
    await payment.save();

    // TODO: Activate subscription, handle referral commission

    res.json({ message: "Payment verified successfully.", payment });
  } catch (error) {
    res.status(500).json({ error: "Payment verification failed." });
  }
});

module.exports = router;
