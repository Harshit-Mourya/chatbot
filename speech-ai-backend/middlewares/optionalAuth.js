const jwt = require("jsonwebtoken");
const User = require("../models/User");

const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expect: Bearer <token>

  if (!token) {
    // No token → treat as guest
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      req.user = null;
    } else {
      req.user = { id: user._id };
    }
  } catch (err) {
    // Invalid token → treat as guest
    req.user = null;
  }

  next();
};

module.exports = optionalAuth;
