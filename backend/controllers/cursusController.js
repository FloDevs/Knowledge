const Cursus = require("../models/Cursus");

// CREATE
exports.createCursus = async (req, res) => {
  try {
    const { title, description, price, theme } = req.body;
    const newCursus = await Cursus.create({ title, description, price, theme });
    res.status(201).json(newCursus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.getAllCursus = async (req, res) => {
  try {
    const cursusList = await Cursus.find({}).populate("theme");
    res.json(cursusList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
exports.getCursusById = async (req, res) => {
  try {
    const cursus = await Cursus.findById(req.params.id).populate("theme");
    if (!cursus) return res.status(404).json({ message: "Cursus not found" });
    res.json(cursus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateCursus = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const updated = await Cursus.findByIdAndUpdate(
      req.params.id,
      { title, description, price },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Cursus not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteCursus = async (req, res) => {
  try {
    await Cursus.findByIdAndDelete(req.params.id);
    res.json({ message: "Cursus deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
