const Cursus = require("../models/Cursus");
// const User = require("../models/User");
const Purchase = require("../models/Purchase");
const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const Certification = require("../models/Certification");

exports.getAllCursusRaw = async () => {
  return await Cursus.find({}).populate("theme").lean();
}; 

exports.getAllCursus = async (req, res) => {
  try {
    const userId = req.session.user ? req.session.user._id : null;

    const cursusList = await Cursus.find({}).populate("theme");

    let cursusAchetésIds = [];

    if (userId) {
      const purchases = await Purchase.find({ user: userId });
      cursusAchetésIds = purchases
        .filter(p => p.cursus)
        .map(p => p.cursus.toString());
    }

    res.render("main/cursus-list", {
      cursusList,
      cursusAchetésIds
    });
  } catch (err) {
    console.error("Erreur dans getAllCursus :", err);
    res.status(500).render("error", {
      message: "Erreur lors de l'affichage de la boutique des cursus",
      error: err
    });
  }
};


exports.getMyCursus = async (req, res) => {
  const userId = req.session.user._id;

  const purchases = await Purchase.find({ user: userId }).populate(["cursus", "lesson"]);
  const cursusAchetés = purchases
    .filter(p => p.cursus)
    .map(p => p.cursus);

  const data = [];

  for (const cursus of cursusAchetés) {
    const lessons = await Lesson.find({ cursus: cursus._id });
    const progress = await LessonProgress.find({
      user: userId,
      lesson: { $in: lessons.map(l => l._id) },
      isCompleted: true
    });

    const progressPercent = lessons.length > 0
      ? Math.round((progress.length / lessons.length) * 100)
      : 0;

    const certif = await Certification.findOne({
      user: userId,
      cursus: cursus._id
    });

    data.push({
      id: cursus._id,
      title: cursus.title,
      progress: progressPercent,
      certified: !!certif
    });
  }

  // 🧠 On récupère les ID des cursus achetés pour filtrer
  const cursusAchetésIds = cursusAchetés.map(c => String(c._id));

  // 🎯 Leçons achetées individuellement
  const leçonsIndividuelles = purchases
    .filter(p => p.lesson && (!p.lesson.cursus || !cursusAchetésIds.includes(String(p.lesson.cursus))))
    .map(p => ({
      id: p.lesson._id,
      title: p.lesson.title,
      cursusTitle: p.lesson.cursus?.title || null
    }));

  res.render("main/dashboard", {
    userCursus: data,
    userLessons: leçonsIndividuelles
  });
};


exports.getCursusById = async (req, res) => {
  try {
    const cursusId = req.params.id;
    const cursus = await Cursus.findById(cursusId).populate("theme");

    if (!cursus) {
      return res.status(404).render("error", { message: "Cursus introuvable" });
    }

    const allLessons = await Lesson.find({ cursus: cursusId });

    let hasCursus = false;
    let purchasedLessonIds = [];
    let completedLessonIds = [];
    let certif = null;

    try {
      const userId = req.session.user._id;

      const purchases = await Purchase.find({ user: userId });

      hasCursus = purchases.some(p => p.cursus?.toString() === cursusId);
      purchasedLessonIds = purchases
        .filter(p => p.lesson)
        .map(p => p.lesson.toString());

      const progress = await LessonProgress.find({
        user: userId,
        lesson: { $in: allLessons.map(l => l._id) },
        isCompleted: true
      });

      completedLessonIds = progress.map(p => p.lesson.toString());

      certif = await Certification.findOne({ user: userId, cursus: cursusId });
    } catch (sessionErr) {
      // utilisateur non connecté
    }

    res.render("main/cursus-details", {
      cursus,
      allLessons,
      hasCursus,
      purchasedLessonIds,
      completedLessonIds,
      certif
    });

  } catch (err) {
    console.error("Erreur affichage cursus :", err);
    res.status(500).render("error", {
      message: "Erreur lors du chargement du cursus.",
      error: err
    });
  }
};

// CREATE
exports.createCursus = async (req, res) => {
  try {
    const { title, description, price, theme } = req.body;
    const newCursus = await Cursus.create({ title, description, price, theme });
    res.status(201).json(newCursus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateCursus = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const updated = await Cursus.findByIdAndUpdate(
      req.params.id,
      { title, description, price },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Cursus not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteCursus = async (req, res) => {
  try {
    await Cursus.findByIdAndDelete(req.params.id);
    res.json({ message: "Cursus deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
