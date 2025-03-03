const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Volunteer = require("../models/volunteer");

const router = express.Router();

// Volunteer Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    // Check if volunteer already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new volunteer (password gets hashed in schema)
    const volunteer = new Volunteer({
      name,
      email,
      phone,
      address,
      password,
    });

    await volunteer.save();
    res.status(201).json({ message: "Volunteer registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/profile", async (req, res) => {
  try {
    const volunteerId = req.query.id
    const volunteer = await Volunteer.findOne({ _id: volunteerId }).select("-password"); // Exclude password
    if (!volunteer) {
      return res.status(404).json({ message: "volunteer not found" });
    }
    res.status(200).json({ volunteer })
  }

  catch {
    console.log(error.message)
  }
})
// Volunteer Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find volunteer by email
    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) {
      return res.status(400).json({ message: "Invalid email or password" });
    }


    // Check password
    const isMatch = await bcrypt.compare(password, volunteer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ volunteerId: volunteer._id }, "your_secret_key", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, volunteer });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
