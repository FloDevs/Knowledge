const mongoose = require('mongoose');
const fs = require('fs/promises');
require('dotenv').config();

const Theme = require('./models/Theme');
const Cursus = require('./models/Cursus');
const Lesson = require('./models/Lesson');

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const cursusRaw = JSON.parse(await fs.readFile('./data/cursus.json', 'utf-8'));
    const lessonsRaw = JSON.parse(await fs.readFile('./data/lessons.json', 'utf-8'));

    // Obtenir tous les thèmes depuis la base
    const themes = await Theme.find({});
    const themeMap = {};
    themes.forEach(theme => {
      themeMap[theme.name] = theme._id;
    });

    // Insérer les cursus avec les bons Theme IDs
    const cursusWithRefs = cursusRaw.map(c => ({
      title: c.title,
      description: c.description || '',
      price: c.price,
      theme: themeMap[c.themeName]
    }));

    const insertedCursus = await Cursus.insertMany(cursusWithRefs);

    const cursusMap = {};
    insertedCursus.forEach(c => {
      cursusMap[c.title] = c._id;
    });

    // Insérer les lessons avec les bons Cursus IDs
    const lessonsWithRefs = lessonsRaw.map(l => ({
      title: l.title,
      description: l.description || '',
      price: l.price,
      cursus: cursusMap[l.cursusTitle]
    }));

    await Lesson.insertMany(lessonsWithRefs);

    console.log("✅ Importation terminée avec succès !");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur lors de l'importation :", err);
    process.exit(1);
  }
}

importData();
