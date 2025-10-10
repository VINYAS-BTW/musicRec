import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route   POST /api/users/login
 * @desc    Create or fetch user by username
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) return res.status(400).json({ error: "Username required" });

    // Find or create user
    let user = await User.findOne({ username });
    if (!user) user = await User.create({ username, preferences: [] });

    res.status(200).json({ username: user.username, preferences: user.preferences });
  } catch (err) {
    console.error(" Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   POST /api/users/preferences
 * @desc    Update user preferences
 * @access  Public
 */
router.post("/preferences", async (req, res) => {
  try {
    const { username, preferences } = req.body;

    if (!username || !preferences)
      return res.status(400).json({ error: "Missing data" });

    const user = await User.findOneAndUpdate(
      { username },
      { preferences },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error(" Preferences Update Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   GET /api/users/:username
 * @desc    Fetch user details (for auto-login check)
 * @access  Public
 */
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error(" Fetch User Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/getPreferences", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ preferences: user.preferences });
  } catch (err) {
    console.error("Get Preferences Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
