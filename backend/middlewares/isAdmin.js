const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
