const Certification = require("../models/Certification");

// GET ALL CERTIFICATIONS (Admin)
exports.getAllCertifications = async (req, res) => {
  try {
    const certifs = await Certification.find({})
      .populate("user")
      .populate("cursus");
    res.json(certifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET USER CERTIFICATIONS
exports.getUserCertifications = async (req, res) => {
  try {
    const { userId } = req; // from auth
    const userCertifs = await Certification.find({ user: userId })
      .populate("cursus");
    res.json(userCertifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
