const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    duration: { type: Number },
    resolution: { type: String },
    path: { type: String, required: true },
    thumbnailPath: { type: String },
    status: {
      type: String,
      enum: ["uploading", "processing", "ready", "error"],
      default: "uploading",
    },
    processingProgress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
