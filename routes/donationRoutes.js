const express = require("express");
const router = express.Router();
const Donation = require("../models/donation");
const { authenticateToken } = require("../middleware/authMiddleware");

// @route   POST /api/donations/create
// @desc    Create a new food donation
// @access  Private (Requires authentication)
router.post("/create", async (req, res) => {
  try {
    const { foodType, quantity, quality, pickupLocation, expiryDate, additionalNotes, donorId } = req.body;

    const newDonation = new Donation({
      donorId,
      foodType,
      quantity,
      quality,
      pickupLocation,
      expiryDate,
      additionalNotes,
      status: "Pending", // Default status
    });

    await newDonation.save();
    res.status(201).json({ message: "Food donation submitted successfully!", donation: newDonation });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// @route   GET /api/donations/view
// @desc    Get all donations
// @access  Public
router.get("/view", async (req, res) => {
  try {
    const donations = await Donation.find().populate("donorId", "name email");
    res.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/donations/view/donor
// @desc    Get all donations made by a specific donor
// @access  Private
router.get("/view/donor", async (req, res) => {
  try {
    const { donorId } = req.query;

    if (!donorId) {
      return res.status(400).json({ message: "Donor ID is required" });
    }

    const donations = await Donation.find({ donorId }).populate("donorId", "name email");

    res.json(donations);
  } catch (error) {
    console.error("Error fetching donations by donor:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PATCH /api/donations/update-status
// @desc    Update the status of a donation
// @access  Private
router.patch("/update-status/:id", async (req, res) => {
  try {
    const { status, volunteerId } = req.body; // Accept volunteerId when updating status
    const validStatuses = ["Pending", "Accepted", "Completed", "Rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status, volunteerId }, // Update status and assign volunteer
      { new: true }
    ).populate("donorId", "name email");

    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json({ message: `Donation status updated to ${status}`, donation: updatedDonation });
  } catch (error) {
    console.error("Error updating donation status:", error);
    res.status(500).json({ message: "Server error" });
  }
});
//view all donations to admin
router.get("/alldonations", async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donorId", "name email phone") // Ensure donor details are included
      .lean(); // Convert Mongoose docs to plain JSON

    if (!donations || donations.length === 0) {
      return res.status(404).json({ message: "No donations found." });
    }

    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
