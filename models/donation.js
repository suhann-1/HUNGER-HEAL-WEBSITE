const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor", // Assuming "User" is your donor model
    required: true,
  },
  foodType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  quality: {
    type: String,
    enum: ["Excellent", "Good", "Average", "Needs Attention"],
    default: "Good",
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: false,
  },
  additionalNotes: {
    type: String,
    default: "",
  }
  
}, { timestamps: true });

module.exports = mongoose.model("Donation", donationSchema);
