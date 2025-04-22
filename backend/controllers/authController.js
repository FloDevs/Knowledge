const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendConfirmationEmail } = require("../mail/mailer");

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!confirmPassword || password !== confirmPassword) {
      req.session.message = "Les mots de passe ne correspondent pas.";
      return res.redirect("/auth/register");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.session.message = "Email déjà utilisé.";
      return res.redirect("/auth/register");
    }

    const newUser = await User.create({
      name,
      email,
      password,
      isVerified: false,
    });

    await sendConfirmationEmail(email, newUser._id);

    req.session.message =
      "Inscription réussie. Veuillez confirmer votre email.";
    res.redirect("/");
  } catch (err) {
    console.error("Erreur lors de l'inscription :", err);
    res.status(500).render("error", {
      message: "Une erreur est survenue lors de l'inscription.",
      error: err,
      pageStylesheet: "error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.session.message = "Identifiant ou mot de passe incorrect";
      return res.redirect("/auth/login");
    }

    if (!user.isVerified) {
      req.session.message = "Veuillez confirmer votre adresse email";
      return res.redirect("/auth/login");
    }

    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    };

    return res.redirect(
      user.isAdmin ? "/admin/dashboard" : "/cursus/dashboard"
    );
  } catch (err) {
    console.error("Erreur lors du login :", err);
    res.status(500).render("error", {
      message: "Une erreur est survenue lors de la connexion.",
      error: err,
      pageStylesheet: "error",
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
      return res.status(500).render("error", {
        message: "Une erreur est survenue lors de la déconnexion.",
        error: err,
        pageStylesheet: "error",
      });
    }
    res.clearCookie("connect.sid");

    req.session = null;
    res.redirect("/auth/login");
  });
};

exports.confirmEmail = async (req, res) => {
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await User.findByIdAndUpdate(userId, { isVerified: true });

    res.render("auth/email-confirmed", {
      message:
        "Votre adresse email a été confirmée avec succès. Vous pouvez maintenant vous connecter.",
      pageStylesheet: "auth/email-confirmed",
    });
  } catch (err) {
    console.error("Erreur confirmation e-mail :", err);

    res.status(400).render("error", {
      message: "Lien invalide ou expiré.",
      error: err,
      pageStylesheet: "error",
    });
  }
};
