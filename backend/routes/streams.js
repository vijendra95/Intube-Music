const express = require("express");
const router = express.Router();
const Stream = require("../models/Stream");
const { auth } = require("../middleware/auth");

// Get all streams for user
router.get("/", auth, async (req, res) => {
  try {
    const streams = await Stream.find({ user: req.user._id })
      .populate("videos", "title filename duration")
      .sort({ createdAt: -1 });
    res.json({ streams });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch streams." });
  }
});

// Create a stream
router.post("/", auth, async (req, res) => {
  try {
    const { title, platform, streamKey, rtmpUrl, extraDestinations, quality, mode, videos } = req.body;

    if (!title || !platform || !streamKey) {
      return res.status(400).json({ error: "Title, platform, and stream key are required." });
    }

    // Check slot limit
    const activeStreams = await Stream.countDocuments({
      user: req.user._id,
      status: { $in: ["starting", "live"] },
    });
    if (activeStreams >= req.user.streamSlots) {
      return res.status(400).json({ error: "Stream slot limit reached. Upgrade your plan." });
    }

    const stream = new Stream({
      user: req.user._id,
      title,
      platform,
      streamKey,
      rtmpUrl: rtmpUrl || getDefaultRtmpUrl(platform),
      extraDestinations: extraDestinations || [],
      quality: quality || "720p",
      mode: mode || "loop",
      videos: videos || [],
    });
    await stream.save();

    res.status(201).json({ stream });
  } catch (error) {
    res.status(500).json({ error: "Failed to create stream." });
  }
});

// Update a stream
router.put("/:id", auth, async (req, res) => {
  try {
    const stream = await Stream.findOne({ _id: req.params.id, user: req.user._id });
    if (!stream) {
      return res.status(404).json({ error: "Stream not found." });
    }
    if (stream.status === "live") {
      return res.status(400).json({ error: "Stop the stream before editing." });
    }
    const { title, platform, streamKey, rtmpUrl, quality, mode, videos } = req.body;
    if (title) stream.title = title;
    if (platform) stream.platform = platform;
    if (streamKey) stream.streamKey = streamKey;
    if (rtmpUrl !== undefined) stream.rtmpUrl = rtmpUrl || getDefaultRtmpUrl(platform || stream.platform);
    if (quality) stream.quality = quality;
    if (mode) stream.mode = mode;
    if (videos !== undefined) stream.videos = videos;
    await stream.save();
    res.json({ stream });
  } catch (error) {
    res.status(500).json({ error: "Failed to update stream." });
  }
});

// Start a stream
router.post("/:id/start", auth, async (req, res) => {
  try {
    const stream = await Stream.findOne({ _id: req.params.id, user: req.user._id });
    if (!stream) {
      return res.status(404).json({ error: "Stream not found." });
    }

    if (stream.status === "live") {
      return res.status(400).json({ error: "Stream is already running." });
    }

    stream.status = "starting";
    stream.startedAt = new Date();
    await stream.save();

    // Start FFmpeg streaming process
    const Video = require("../models/Video");
    const userVideos = await Video.find({ user: req.user._id, status: { $in: ["ready", "processing"] } });

    if (userVideos.length === 0) {
      stream.status = "idle";
      await stream.save();
      return res.status(400).json({ error: "Upload at least one video before starting stream." });
    }

    // TODO: Launch FFmpeg in production
    stream.status = "live";
    await stream.save();

    res.json({ stream, message: "Stream started successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to start stream." });
  }
});

// Stop a stream
router.post("/:id/stop", auth, async (req, res) => {
  try {
    const stream = await Stream.findOne({ _id: req.params.id, user: req.user._id });
    if (!stream) {
      return res.status(404).json({ error: "Stream not found." });
    }

    stream.status = "idle";
    stream.stoppedAt = new Date();
    if (stream.startedAt) {
      stream.totalStreamTime += (new Date() - stream.startedAt) / 1000;
    }
    stream.processId = null;
    await stream.save();

    // TODO: Kill FFmpeg process here

    res.json({ stream, message: "Stream stopped." });
  } catch (error) {
    res.status(500).json({ error: "Failed to stop stream." });
  }
});

// Delete a stream
router.delete("/:id", auth, async (req, res) => {
  try {
    const stream = await Stream.findOne({ _id: req.params.id, user: req.user._id });
    if (!stream) {
      return res.status(404).json({ error: "Stream not found." });
    }

    if (stream.status === "live") {
      return res.status(400).json({ error: "Stop the stream before deleting." });
    }

    await stream.deleteOne();
    res.json({ message: "Stream deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete stream." });
  }
});

function getDefaultRtmpUrl(platform) {
  const urls = {
    youtube: "rtmp://a.rtmp.youtube.com/live2",
    facebook: "rtmps://live-api-s.facebook.com:443/rtmp/",
    twitch: "rtmp://live.twitch.tv/app",
    custom: "",
  };
  return urls[platform] || "";
}

module.exports = router;
