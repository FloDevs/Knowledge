const Lesson = require("../models/Lesson");
const Purchase = require("../models/Purchase");
const LessonProgress = require("../models/LessonProgress");


exports.getAllLessons = async () => {
  return await Lesson.find().lean();
};

// CREATE
exports.createLesson = async (req, res) => {
  try {
    const { title, description, videoUrl, documentUrl, price, cursus } = req.body;
    const newLesson = await Lesson.create({
      title,
      description,
      videoUrl,
      documentUrl,
      price,
      cursus,
    });
    res.status(201).json(newLesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET BY ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("cursus");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateLesson = async (req, res) => {
  try {
    const { title, description, videoUrl, documentUrl, price } = req.body;
    const updated = await Lesson.findByIdAndUpdate(
      req.params.id,
      { title, description, videoUrl, documentUrl, price },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Lesson not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: "Lesson deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLessonViewById = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { id } = req.params;

    const lesson = await Lesson.findById(id).populate("cursus");
    if (!lesson) {
      return res.status(404).render("error", { message: "Leçon introuvable." });
    }

    const cursusId = lesson.cursus?._id;

    // Vérifie que l'utilisateur a acheté le cursus ou la leçon
    const hasAccess = await Purchase.findOne({
      user: userId,
      $or: [
        { lesson: id },
        { cursus: cursusId }
      ]
    });

    if (!hasAccess) {
      return res.status(403).render("error", {
        message: "Vous n'avez pas accès à cette leçon."
      });
    }

    // Progression
    const progress = await LessonProgress.findOne({
      user: userId,
      lesson: id
    });

    const isCompleted = progress?.isCompleted || false;

    res.render("main/lesson", {
      lesson,
      cursus: lesson.cursus,
      isCompleted
    });
  } catch (err) {
    console.error("Erreur vue leçon :", err);
    res.status(500).render("error", {
      message: "Erreur lors du chargement de la leçon.",
      error: err
    });
  }
};