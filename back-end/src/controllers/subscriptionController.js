import { body, validationResult } from "express-validator";
import Subscription from "../models/Subscription.js";
//import { sendWelcomeEmail, sendUnsubscribeConfirmation } from "../utils/emailService.js";

// Validation middleware
export const validateEmail = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
];

// Subscribe
export const subscribe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, preferences } = req.body;
    let sub = await Subscription.findOne({ email });

    if (sub && sub.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "Already subscribed" });
    }

    if (sub && !sub.isActive) {
      sub.isActive = true;
      sub.subscribedAt = Date.now();
      sub.unsubscribedAt = null;
      if (preferences) {
        sub.preferences = { ...sub.preferences, ...preferences };
      }
    } else {
      sub = new Subscription({
        email,
        preferences: preferences || {},
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
    }

    await sub.save();

    res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      data: { email: sub.email, preferences: sub.preferences },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error subscribing", error: error.message });
  }
};

// Unsubscribe
export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const sub = await Subscription.findOne({ email });

    if (!sub || !sub.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found or inactive" });
    }

    sub.isActive = false;
    sub.unsubscribedAt = Date.now();
    await sub.save();
    await sendUnsubscribeConfirmation(email);

    res.json({ success: true, message: "Unsubscribed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error unsubscribing", error: error.message });
  }
};

// Update preferences
export const updatePreferences = async (req, res) => {
  try {
    const { email, preferences } = req.body;
    const sub = await Subscription.findOne({ email, isActive: true });

    if (!sub) {
      return res
        .status(404)
        .json({ success: false, message: "Active subscription not found" });
    }

    sub.preferences = { ...sub.preferences, ...preferences };
    await sub.save();

    res.json({
      success: true,
      message: "Preferences updated",
      data: sub.preferences,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating preferences", error: error.message });
  }
};

// Get active subscriptions
export const getActiveSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ isActive: true })
      .select("email preferences subscribedAt")
      .sort("-subscribedAt");

    res.json({ success: true, count: subs.length, data: subs });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching subscriptions", error: error.message });
  }
};

// Get stats
export const getStats = async (req, res) => {
  try {
    const totalActive = await Subscription.countDocuments({ isActive: true });
    const totalInactive = await Subscription.countDocuments({ isActive: false });
    const last7Days = await Subscription.countDocuments({
      subscribedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    res.json({
      success: true,
      data: {
        totalActive,
        totalInactive,
        total: totalActive + totalInactive,
        last7Days,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching stats", error: error.message });
  }
};