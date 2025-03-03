const express = require("express");
const router = express.Router();
const Donation = require("../models/donation");
const { authenticateToken } = require("../middleware/authMiddleware");

// @route   POST /api/donations
// @desc    Create a new food donation
// @access  Private (Requires authentication)
router.post("/create",  async (req, res) => {
  try {
    const { foodType, quantity, quality, pickupLocation, expiryDate, additionalNotes,donorId } = req.body;
    // const donorId = req.user.id; // Extract donor ID from token

    const newDonation = new Donation({
      donorId,
      foodType,
      quantity,
      quality,
      pickupLocation,
      expiryDate,
      additionalNotes,
    });

    await newDonation.save();
    res.status(201).json({ message: "Food donation submitted successfully!", donation: newDonation });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// @route   GET /api/donations
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

// // @route   GET /api/donations/:donorId
// // @desc    Get all donations by a specific donor
// // @access  Private (Requires authentication)
// router.get("/:donorId", authenticateToken, async (req, res) => {
//   try {
//     const { donorId } = req.params;
//     if (req.user.id !== donorId) {
//       return res.status(403).json({ message: "Unauthorized access" });
//     }

//     const donations = await Donation.find({ donorId });
//     res.json(donations);
//   } catch (error) {
//     console.error("Error fetching donor donations:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// @route   DELETE /api/donations/:donationId
// @desc    Delete a donation
// @access  Private (Only the donor can delete their donation)
// router.delete("/:donationId", authenticateToken, async (req, res) => {
//   try {
//     const donation = await Donation.findById(req.params.donationId);
//     if (!donation) {
//       return res.status(404).json({ message: "Donation not found" });
//     }

//     // Check if the logged-in user is the donor
//     if (donation.donorId.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Unauthorized action" });
//     }

//     await Donation.findByIdAndDelete(req.params.donationId);
//     res.json({ message: "Donation deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting donation:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

module.exports = router;
