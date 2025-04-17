const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user?._id);
    if (user && user.isAdmin) {
      return next(); 
    } else {
      return res.status(403).json({ message: "Accès refusé" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

