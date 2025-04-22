const Theme = require("../models/Theme");

exports.getAllThemes = async () => {
  return await Theme.find({}).lean();
};

exports.createTheme = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      req.session.message = "Le nom du thème est requis.";
      return res.redirect('/admin/cursus');
    }

    await Theme.create({ name: name.trim() });

    req.session.message = "Thème créé avec succès !";
    res.redirect('/admin/cursus');
  } catch (err) {
    console.error("Erreur createTheme:", err);
    req.session.message = "Erreur lors de la création du thème.";
    res.redirect('/admin/cursus');
  }
};

exports.getThemeById = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) return res.status(404).json({ message: "Theme not found" });
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTheme = async (req, res) => {
  try {
    const { name } = req.body;

    const theme = await Theme.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!theme) {
      req.session.message = "Thème introuvable.";
      return res.redirect("/admin/cursus");
    }

    req.session.message = "Thème mis à jour avec succès !";
    res.redirect("/admin/cursus");
  } catch (err) {
    console.error("Erreur updateTheme:", err);
    req.session.message = "Erreur serveur lors de la mise à jour du thème.";
    res.redirect("/admin/cursus");
  }
};

exports.deleteTheme = async (req, res) => {
  try {
    await Theme.findByIdAndDelete(req.params.id);

    req.session.message = "Thème supprimé avec succès.";
    res.redirect("/admin/cursus");
  } catch (err) {
    console.error("Erreur deleteTheme:", err);
    req.session.message = "Erreur serveur lors de la suppression du thème.";
    res.redirect("/admin/cursus");
  }
};
