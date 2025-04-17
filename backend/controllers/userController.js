const User = require("../models/User");
const Purchase = require("../models/Purchase");
const bcrypt = require('bcrypt');
// const Lesson = require("../models/Lesson");
// const Cursus = require("../models/Cursus");
const LessonProgress = require("../models/LessonProgress");

// GET ALL USERS (Admin)
exports.getAllUsers = async () => {
  return await User.find().lean();
};


// GET USER BY ID (Admin or same user)
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("Utilisateur non trouvé.");

    res.render('main/profile', {
      pageTitle: 'Mon profil',
      user
    });
  } catch (err) {
    console.error("Erreur profil :", err);
    res.status(500).send("Erreur serveur");
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.params.id;
    const sessionUser = req.session.user;

    if (sessionUser._id.toString() !== userId && !sessionUser.isAdmin) {
      return res.status(403).send("Non autorisé");
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("Utilisateur non trouvé");

    user.name = name || user.name;
    await user.save();

    req.session.message = "Profil mis à jour avec succès";
    res.redirect("/cursus/dashboard");

  } catch (err) {
    console.error("Erreur updateUser:", err);
    res.status(500).send("Erreur serveur");
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.user._id;

    const user = await User.findById(userId);
    if (!user) {
      req.session.message = "Utilisateur non trouvé.";
      return res.redirect('/users/profile');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      req.session.message = "Mot de passe actuel incorrect.";
      return res.redirect('/users/profile');
    }

    if (newPassword !== confirmPassword) {
      req.session.message = "La confirmation ne correspond pas.";
      return res.redirect('/users/profile');
    }

    if (newPassword.length < 6) {
      req.session.message = "Le mot de passe doit contenir au moins 6 caractères.";
      return res.redirect('/users/profile');
    }

    user.password = newPassword;
    await user.save(); 

    req.session.message = "Mot de passe mis à jour avec succès.";
    res.redirect('/cursus/dashboard');
  } catch (err) {
    console.error("Erreur updatePassword:", err);
    req.session.message = "Erreur serveur.";
    res.redirect('/users/profile');
  }
};




// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyContent = async (req, res) => {
  try {
    const userId = req.session.user._id;

    // Récupère tous les achats
    const purchases = await Purchase.find({ user: userId })
      .populate("cursus")
      .populate("lesson");

    // Sépare cursus et leçons
    const cursusAchetés = purchases
      .filter(p => p.cursus)
      .map(p => p.cursus);

    const leçonsAchetées = purchases
      .filter(p => p.lesson)
      .map(p => p.lesson);

    // Récupérer la progression des leçons
    const progressList = await LessonProgress.find({ user: userId });

    res.render("user/my-content", {
      cursusAchetés,
      leçonsAchetées,
      progressList
    });
  } catch (err) {
    console.error("Erreur récupération contenu utilisateur :", err);
    res.status(500).render("error", {
      message: "Impossible d'afficher vos contenus",
      error: err
    });
  }
};