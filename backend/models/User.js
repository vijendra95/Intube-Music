const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, minlength: 8 },
    googleId: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    plan: {
      type: String,
      enum: ["free", "basic", "popular", "custom"],
      default: "free",
    },
    planExpiry: { type: Date },
    storage: {
      used: { type: Number, default: 0 },
      limit: { type: Number, default: 1073741824 }, // 1 GB in bytes
    },
    streamSlots: { type: Number, default: 1 },
    referralCode: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    billingDetails: {
      company: String,
      gst: String,
      address: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre("save", function (next) {
  if (!this.referralCode) {
    this.referralCode = `INTUBE-${this._id.toString().slice(-6).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
