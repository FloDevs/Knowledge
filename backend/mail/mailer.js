const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendConfirmationEmail = async (userEmail, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

  const confirmationUrl = `${process.env.BASE_URL}/confirm?token=${token}`;

  try {
    await transporter.sendMail({
      from: `"Knowledge Learning" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Confirmez votre inscription',
      html: `
        <h1>Bienvenue !</h1>
        <p>Merci de vous être inscrit. Veuillez confirmer votre adresse e-mail en cliquant sur ce lien :</p>
        <a href="${confirmationUrl}">Confirmer mon e-mail</a>
        <p>Ce lien expirera dans 24 heures.</p>
      `
    });

    console.log('Email de confirmation envoyé à', userEmail);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
  }
};

module.exports = { sendConfirmationEmail };