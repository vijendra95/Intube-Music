const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "IntubeMedia.live" },
    siteUrl: { type: String, default: "https://intubemedia.live" },
    supportEmail: { type: String, default: "support@intubemedia.live" },
    maxVideoSize: { type: Number, default: 2 },
    defaultStreamSlots: { type: Number, default: 1 },
    defaultStorage: { type: Number, default: 1 },
    razorpayEnabled: { type: Boolean, default: false },
    razorpayKeyId: { type: String, default: "" },
    maintenanceMode: { type: Boolean, default: false },
    signupsEnabled: { type: Boolean, default: true },
    referralCommission: { type: Number, default: 10 },
    maxFreeVideos: { type: Number, default: 3 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
