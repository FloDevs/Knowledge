const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getAllUsers = async () => {
  return await User.find().lean();
};

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("Utilisateur non trouvé.");

    res.render("main/profile", {
      pageTitle: "Mon profil",
      user,
      pageStylesheet: "main/profile",
    });
  } catch (err) {
    console.error("Erreur profil :", err);
    res.status(500).send("Erreur serveur");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, isAdmin } = req.body;
    const userId = req.params.id;
    const sessionUser = req.session.user;

    if (sessionUser._id.toString() !== userId && !sessionUser.isAdmin) {
      return res.status(403).send("Non autorisé");
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("Utilisateur non trouvé");

    user.name = name || user.name;
    user.email = email || user.email;

    // Seul un admin peut modifier le type d'utilisateur
    if (sessionUser.isAdmin && typeof isAdmin !== "undefined") {
      user.isAdmin = isAdmin === "true";
    }

    await user.save();

    req.session.message = "Utilisateur mis à jour avec succès";

    if (sessionUser.isAdmin) {
      res.redirect("/admin/users");
    } else {
      res.redirect("/users/profile");
    }
  } catch (err) {
    console.error("Erreur updateUser:", err);
    req.session.message = "Erreur lors de la mise à jour";
    res.redirect("/admin/users");
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.user._id;

    const user = await User.findById(userId);
    if (!user) {
      req.session.message = "Utilisateur non trouvé.";
      return res.redirect("/users/profile");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      req.session.message = "Mot de passe actuel incorrect.";
      return res.redirect("/users/profile");
    }

    if (newPassword !== confirmPassword) {
      req.session.message = "La confirmation ne correspond pas.";
      return res.redirect("/users/profile");
    }

    const errors = [];
    if (newPassword.length < 6) {
      errors.push("Le mot de passe doit contenir au moins 6 caractères.");
    }
    if (!/[A-Z]/.test(newPassword)) {
      errors.push("Le mot de passe doit contenir au moins une majuscule.");
    }
    if (!/\d/.test(newPassword)) {
      errors.push("Le mot de passe doit contenir au moins un chiffre.");
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      errors.push(
        "Le mot de passe doit contenir au moins un caractère spécial."
      );
    }

    if (errors.length > 0) {
      req.session.message = errors[0];
      return res.redirect("/users/profile");
    }

    user.password = newPassword;
    await user.save();

    req.session.message = "Mot de passe mis à jour avec succès.";
    res.redirect("/users/profile");
  } catch (err) {
    console.error("Erreur updatePassword:", err);
    req.session.message = "Erreur serveur.";
    res.redirect("/users/profile");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
