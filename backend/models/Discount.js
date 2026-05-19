const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discount: { type: Number, required: true },
    type: { type: String, enum: ["percent", "fixed"], default: "percent" },
    maxUses: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", discountSchema);
