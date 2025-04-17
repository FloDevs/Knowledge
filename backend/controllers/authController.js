const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendConfirmationEmail } = require('../mail/mailer');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect('/register?message=Email%20déjà%20utilisé');
    }

    const newUser = await User.create({
      name,
      email,
      password, // hashé en middleware si tu utilises un pre('save')
      isVerified: false
    });

    // Envoi de l'e-mail de confirmation
    await sendConfirmationEmail(email, newUser._id);

    res.redirect('/?message=Inscription%20réussie.%20Veuillez%20confirmer%20votre%20email.');
  } catch (err) {
    console.error('Erreur lors de l\'inscription :', err);
    res.status(500).render('error', {
      message: "Une erreur est survenue lors de l'inscription.",
      error: err
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.redirect('/login?message=Identifiant%20ou%20mot%20de%20passe%20incorrect');
    }

    // 🔐 Vérifie la confirmation de l'e-mail
    if (!user.isVerified) {
      return res.redirect('/login?message=Veuillez%20confirmer%20votre%20adresse%20email');
    }

    // Stocke les infos utilisateur en session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    };

    // Redirige en fonction du rôle
    if (user.isAdmin) {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/cursus/dashboard');
    }

  } catch (err) {
    console.error('Erreur lors du login :', err);
    res.status(500).render('error', {
      message: 'Une erreur est survenue lors de la connexion.',
      error: err,
    });
  }
};


// LOGOUT

exports.logout = (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
      return res.status(500).render('error', {
        message: "Une erreur est survenue lors de la déconnexion.",
        error: err,
      });
    }

    res.clearCookie('connect.sid');

    res.redirect('/auth/login?message=Déconnexion%20réussie');
  });
};



exports.confirmEmail = async (req, res) => {
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await User.findByIdAndUpdate(userId, { isVerified: true });

    res.render('auth/email-confirmed', {
      message: 'Votre adresse email a été confirmée avec succès. Vous pouvez maintenant vous connecter.'
    });
  } catch (err) {
    console.error("Erreur confirmation e-mail :", err);

    res.status(400).render('error', {
      message: 'Lien invalide ou expiré.',
      error: err
    });
  }
};


