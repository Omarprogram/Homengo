import Counter from "../models/Counter.js";

// Get all counters
export const getAllCounters = async (req, res) => {
  try {
    const counters = await Counter.find().sort("type");
    const formatted = counters.map((c) => {
      let displayValue = c.value.toString();
      if (c.displayFormat === "plus" && c.value > 0)
        displayValue = c.value + " +";
      if (c.displayFormat === "star")
        displayValue = c.value.toFixed(1) + " ★";
      return {
        type: c.type,
        value: c.value,
        displayValue,
        label: c.label,
        icon: c.icon,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching counters",
      error: error.message,
    });
  }
};

// Get single counter
export const getCounter = async (req, res) => {
  try {
    const counter = await Counter.findOne({ type: req.params.type });
    if (!counter) {
      return res
        .status(404)
        .json({ success: false, message: "Counter not found" });
    }
    res.json({ success: true, data: counter });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching counter",
      error: error.message,
    });
  }
};

// Update counter
export const updateCounter = async (req, res) => {
  try {
    const { value, increment } = req.body;
    const counter = await Counter.findOne({ type: req.params.type });
    if (!counter) {
      return res
        .status(404)
        .json({ success: false, message: "Counter not found" });
    }

    if (increment) counter.value += increment;
    else if (value !== undefined) counter.value = value;

    counter.lastUpdated = Date.now();
    await counter.save();

    res.json({
      success: true,
      message: "Counter updated successfully",
      data: counter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating counter",
      error: error.message,
    });
  }
};

// Seed counters with default values
export const seedCounters = async (req, res) => {
  try {
    const defaults = [
  {
    type: "workers",
    value: 10,
    label: "Verified Service Providers",
    displayFormat: "plus",
  },
  {
    type: "locations",
    value: 1,
    label: "Service Locations", // Changed this
    displayFormat: "plus",
  },
  {
    type: "contracts",
    value: 100,
    label: "Completed Contracts", // Changed this
    displayFormat: "plus",
  },
  {
    type: "rating",
    value: 4.5, // Changed from 0.5 to 4.5
    label: "Average Rating", // Changed this
    displayFormat: "star",
  },
];

    for (const c of defaults) {
      await Counter.findOneAndUpdate({ type: c.type }, c, {
        upsert: true,
        new: true,
      });
    }

    res.json({
      success: true,
      message: "Counters initialized successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error seeding counters",
      error: error.message,
    });
  }
};