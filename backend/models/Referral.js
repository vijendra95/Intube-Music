const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    referred: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    commissionRate: { type: Number, default: 10 },
    totalEarnings: { type: Number, default: 0 },
    paymentCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Referral", referralSchema);
