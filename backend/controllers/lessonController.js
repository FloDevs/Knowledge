const Lesson = require("../models/Lesson");
const Purchase = require("../models/Purchase");
const LessonProgress = require("../models/LessonProgress");

exports.getAllLessons = async () => {
  return await Lesson.find().lean();
};

exports.createLesson = async (req, res) => {
  try {
    const { title, description, videoUrl, documentUrl, price, cursus } =
      req.body;

    await Lesson.create({
      title,
      description,
      videoUrl,
      documentUrl,
      price,
      cursus,
    });

    req.session.message = "Leçon créée avec succès !";
    res.redirect("/admin/cursus");
  } catch (err) {
    console.error("Erreur createLesson:", err);
    req.session.message = "Erreur lors de la création de la leçon.";
    res.redirect("/admin/cursus");
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { title, description, videoUrl, documentUrl, price } = req.body;

    const updated = await Lesson.findByIdAndUpdate(
      req.params.id,
      { title, description, videoUrl, documentUrl, price },
      { new: true }
    );

    if (!updated) {
      req.session.message = "Leçon introuvable.";
    } else {
      req.session.message = "Leçon mise à jour avec succès !";
    }

    res.redirect("/admin/cursus");
  } catch (err) {
    console.error("Erreur updateLesson:", err);
    req.session.message = "Erreur serveur lors de la mise à jour.";
    res.redirect("/admin/cursus");
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);

    req.session.message = "Leçon supprimée avec succès.";
    res.redirect("/admin/cursus");
  } catch (err) {
    console.error("Erreur deleteLesson:", err);
    req.session.message = "Erreur lors de la suppression de la leçon.";
    res.redirect("/admin/cursus");
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

    // Check that the user has purchased the cursus or the lesson
    const hasAccess = await Purchase.findOne({
      user: userId,
      $or: [{ lesson: id }, { cursus: cursusId }],
    });

    if (!hasAccess) {
      return res.status(403).render("error", {
        message: "Vous n'avez pas accès à cette leçon.",
      });
    }

    // Progress
    const progress = await LessonProgress.findOne({
      user: userId,
      lesson: id,
    });

    const isCompleted = progress?.isCompleted || false;

    res.render("main/lesson", {
      lesson,
      cursus: lesson.cursus,
      isCompleted,
      pageStylesheet: "main/lesson",
    });
  } catch (err) {
    console.error("Erreur vue leçon :", err);
    res.status(500).render("error", {
      message: "Erreur lors du chargement de la leçon.",
      error: err,
    });
  }
};
