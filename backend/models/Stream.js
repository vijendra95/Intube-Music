const mongoose = require("mongoose");

const streamSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    platform: {
      type: String,
      enum: ["youtube", "facebook", "twitch", "custom"],
      required: true,
    },
    streamKey: { type: String, required: true },
    rtmpUrl: { type: String },
    extraDestinations: [
      {
        platform: { type: String, enum: ["youtube", "facebook", "twitch", "custom"] },
        streamKey: String,
        rtmpUrl: String,
      },
    ],
    quality: { type: String, enum: ["720p", "1080p"], default: "720p" },
    mode: { type: String, enum: ["loop", "once"], default: "loop" },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    status: {
      type: String,
      enum: ["idle", "starting", "live", "stopping", "error"],
      default: "idle",
    },
    health: {
      bitrate: Number,
      fps: Number,
      lastHeartbeat: Date,
      errorCount: { type: Number, default: 0 },
    },
    startedAt: { type: Date },
    stoppedAt: { type: Date },
    totalStreamTime: { type: Number, default: 0 },
    processId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stream", streamSchema);
