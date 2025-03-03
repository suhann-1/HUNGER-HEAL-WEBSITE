const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Donor = require("../models/donor");
const authenticate = require("../middleware/authMiddleware"); // Middleware to verify token

const router = express.Router();

// Donor Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, address, certificate, licenseNo, password } = req.body;

    // Check if donor already exists
    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new donor
    const donor = new Donor({
      name,
      email,
      phone,
      address,
      certificate,
      licenseNo,
      password: hashedPassword,
    });

    await donor.save();
    res.status(201).json({ message: "Donor registered successfully" });
  } catch (error) {
    res.status(500).json({ message:error.message });
  }
});

// Donor Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find donor by email
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(400).json({ message: "Invalid email " });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid  password" });
    }

    // Generate JWT token
    const token = jwt.sign({ donorId: donor._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, donor });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Donor Profile (Dashboard)
router.get("/profile", async (req, res) => {
  try {
    const donerId=req.query.id
    const donor = await Donor.findById(donerId).select("-password"); // Exclude password
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    // Simulated donor statistics (replace with real values from DB)
    donor.donationValue = 500; // Example: Total donation value in $
    donor.mealsDonated = 120; // Example: Number of meals donated
    donor.charitiesHelped = 3; // Example: Number of charities supported
    donor.activeDonations = [{ foodType: "Rice", quantity: 50 }]; // Example active donation

    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
