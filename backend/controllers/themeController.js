const Theme = require("../models/Theme");

// CREATE
exports.createTheme = async (req, res) => {
  try {
    const { name } = req.body;
    const newTheme = await Theme.create({ name });
    res.status(201).json(newTheme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find({});
    res.json(themes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE
exports.getThemeById = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) return res.status(404).json({ message: "Theme not found" });
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateTheme = async (req, res) => {
  try {
    const { name } = req.body;
    const theme = await Theme.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!theme) return res.status(404).json({ message: "Theme not found" });
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteTheme = async (req, res) => {
  try {
    await Theme.findByIdAndDelete(req.params.id);
    res.json({ message: "Theme deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
