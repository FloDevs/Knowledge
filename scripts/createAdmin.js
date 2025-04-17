// createAdmin.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../backend/models/User'); // adapte le chemin si besoin
require('dotenv').config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const admin = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: "superpassword",
      isAdmin: true,
      isVerified: true,
    });

    await admin.save();
    console.log('✅ Admin créé avec succès !');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Erreur lors de la création de l\'admin :', err);
    mongoose.disconnect();
  }
}

main();
