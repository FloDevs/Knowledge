const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../backend/models/User");
const Cursus = require("../backend/models/Cursus");
const Purchase = require("../backend/models/Purchase");

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = await User.findOne({ email: "admin@example.com" });
    const cursus = await Cursus.findOne(); // prend le premier cursus

    if (!user || !cursus) {
      throw new Error("Utilisateur ou cursus introuvable");
    }

    await Purchase.create({
      user: user._id,
      cursus: cursus._id,
      type: "cursus"
    });

    console.log("Achat factice créé avec succès !");
    process.exit();
  } catch (err) {
    console.error("Erreur :", err);
    process.exit(1);
  }
}

run();
