const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    description: { type: String },
    plan: { type: String, enum: ["basic", "popular", "custom"] },
    duration: { type: Number },
    durationUnit: { type: String, enum: ["days", "weeks", "months"] },
    status: {
      type: String,
      enum: ["created", "pending", "success", "failed", "refunded"],
      default: "created",
    },
    razorpaySignature: { type: String },
    invoiceUrl: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
