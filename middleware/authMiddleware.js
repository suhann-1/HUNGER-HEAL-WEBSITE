const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.donorId = decoded.donorId; // Attach donorId to request object
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;
