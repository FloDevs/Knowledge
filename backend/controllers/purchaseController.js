const Purchase = require("../models/Purchase");

// CREATE PURCHASE
exports.createPurchase = async (req, res) => {
  try {
    const { userId } = req; // supposons que le middleware auth place req.userId
    const { cursusId, lessonId } = req.body;

    // Vérification : cursusId OU lessonId doit être défini
    if (!cursusId && !lessonId) {
      return res.status(400).json({ message: "Cursus or Lesson required" });
    }

    const newPurchase = await Purchase.create({
      user: userId,
      cursus: cursusId || null,
      lesson: lessonId || null,
    });

    res.status(201).json(newPurchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL PURCHASES (Admin)
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({})
      .populate("user")
      .populate("cursus")
      .populate("lesson");
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET PURCHASES BY USER
exports.getUserPurchases = async (req, res) => {
  try {
    const { userId } = req; // from auth
    const userPurchases = await Purchase.find({ user: userId })
      .populate("cursus")
      .populate("lesson");
    res.json(userPurchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
