const mongoose = require('mongoose');
const fs = require('fs/promises');
require('dotenv').config();

const Theme = require('../backend/models/Theme');
const Cursus = require('../backend/models/Cursus');
const Lesson = require('../backend/models/Lesson');


async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Lire les fichiers JSON
    const themesRaw = JSON.parse(await fs.readFile('./data/themes.json', 'utf-8'));
    const cursusRaw = JSON.parse(await fs.readFile('./data/cursus.json', 'utf-8'));
    const lessonsRaw = JSON.parse(await fs.readFile('./data/lessons.json', 'utf-8'));

    // Insérer les thèmes en base
    const insertedThemes = await Theme.insertMany(themesRaw);
    const themeMap = {};
    insertedThemes.forEach(theme => {
      themeMap[theme.name] = theme._id;
    });

    // Insérer les cursus avec référence au thème
    const cursusWithRefs = cursusRaw.map(c => ({
      title: c.title,
      description: c.description || '',
      price: c.price,
      theme: themeMap[c.themeName],
      featured: c.featured || false,
      img: c.img || ''
    }));

    const insertedCursus = await Cursus.insertMany(cursusWithRefs);
    const cursusMap = {};
    insertedCursus.forEach(c => {
      cursusMap[c.title] = c._id;
    });

    // Insérer les leçons avec référence au cursus
    const lessonsWithRefs = lessonsRaw.map(l => ({
      title: l.title,
      description: l.description || '',
      price: l.price,
      cursus: cursusMap[l.cursusTitle],
      videoUrl: l.videoUrl || '',
      documentUrl: l.documentUrl || '',
      textContent: l.textContent || ''
    }));

    await Lesson.insertMany(lessonsWithRefs);

    console.log("Importation terminée avec succès !");
    process.exit();
  } catch (err) {
    console.error("Erreur lors de l'importation :", err);
    process.exit(1);
  }
}

importData();

