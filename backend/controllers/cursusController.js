const Cursus = require("../models/Cursus");
const Purchase = require("../models/Purchase");
const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const Certification = require("../models/Certification");
const fs = require("fs");
const path = require("path");

exports.getAllCursusRaw = async () => {
  return await Cursus.find({}).populate("theme").lean();
};

exports.getAllCursus = async (req, res) => {
  try {
    const userId = req.session.user ? req.session.user._id : null;
    const searchQuery = req.query.q ? req.query.q.toLowerCase() : "";

    let cursusList = await Cursus.find({}).populate("theme");

    // Filter if searching
    if (searchQuery) {
      cursusList = cursusList.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery) ||
          (c.description && c.description.toLowerCase().includes(searchQuery))
      );
    }

    let purchasedCursusIds = [];

    if (userId) {
      const purchases = await Purchase.find({ user: userId });
      purchasedCursusIds = purchases
        .filter((p) => p.cursus)
        .map((p) => p.cursus.toString());
    }

    res.render("main/cursus-list", {
      cursusList,
      purchasedCursusIds,
      searchQuery,
      pageStylesheet: "main/cursus-list",
    });
  } catch (err) {
    console.error("Erreur dans getAllCursus :", err);
    res.status(500).render("error", {
      message: "Erreur lors de l'affichage de la boutique des cursus",
      error: err,
    });
  }
};

exports.createCursus = async (req, res) => {
  try {
    const { title, description, price, theme } = req.body;
    const img = req.file ? req.file.filename : "default.jpg";
    const featured = req.body.featured === "true";

    await Cursus.create({ title, description, price, theme, featured, img });

    req.session.message = "Cursus créé avec succès !";
    res.redirect("/admin/cursus");
  } catch (err) {
    console.error("Erreur createCursus:", err);
    req.session.message = "Erreur lors de la création du cursus.";
    res.redirect("/admin/cursus");
  }
};

exports.updateCursus = async (req, res) => {
  try {
    const { title, description, price, theme } = req.body;
    const featured = req.body.featured === "true";

    const cursus = await Cursus.findById(req.params.id);
    if (!cursus) {
      req.session.message = "Cursus introuvable.";
      return res.redirect("/admin/cursus");
    }

    if (req.file) {
      if (cursus.img && cursus.img !== "default.jpg") {
        const oldImgPath = path.join(
          __dirname,
          "../public/uploads/cursus",
          cursus.img
        );
        if (fs.existsSync(oldImgPath)) {
          fs.unlinkSync(oldImgPath);
        }
      }
      cursus.img = req.file.filename;
    }

    cursus.title = title;
    cursus.description = description;
    cursus.price = price;
    cursus.theme = theme;
    cursus.featured = featured;

    await cursus.save();

    req.session.message = "Cursus mis à jour avec succès !";
    res.redirect("/admin/cursus");
  } catch (err) {
    console.error("Erreur updateCursus:", err);
    req.session.message = "Erreur serveur lors de la mise à jour.";
    res.redirect("/admin/cursus");
  }
};

exports.deleteCursus = async (req, res) => {
  try {
    const cursus = await Cursus.findById(req.params.id);
    if (!cursus) {
      req.session.message = "Cursus introuvable.";
      return res.redirect("/admin/cursus");
    }

    // Delete the image if it exists
    if (cursus.img && cursus.img !== "default.jpg") {
      const imgPath = path.join(
        __dirname,
        "../public/uploads/cursus",
        cursus.img
      );
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await cursus.deleteOne();

    req.session.message = "Cursus supprimé avec succès.";
    res.redirect("/admin/cursus");
  } catch (err) {
    console.error("Erreur deleteCursus:", err);
    req.session.message = "Erreur lors de la suppression du cursus.";
    res.redirect("/admin/cursus");
  }
};

exports.getMyCursus = async (req, res) => {
  const userId = req.session.user._id;

  const purchases = await Purchase.find({ user: userId }).populate([
    "cursus",
    "lesson",
  ]);
  const purchasedCursus = purchases
    .filter((p) => p.cursus)
    .map((p) => p.cursus);

  const data = [];

  for (const cursus of purchasedCursus) {
    const lessons = await Lesson.find({ cursus: cursus._id });
    const progress = await LessonProgress.find({
      user: userId,
      lesson: { $in: lessons.map((l) => l._id) },
      isCompleted: true,
    });

    const progressPercent =
      lessons.length > 0
        ? Math.round((progress.length / lessons.length) * 100)
        : 0;

    const certif = await Certification.findOne({
      user: userId,
      cursus: cursus._id,
    });

    data.push({
      id: cursus._id,
      title: cursus.title,
      progress: progressPercent,
      certified: !!certif,
      img: cursus.img,
    });
  }

  const purchasedCursusIds = purchasedCursus.map((c) => String(c._id));

  const individualLessons = purchases
    .filter(
      (p) =>
        p.lesson &&
        (!p.lesson.cursus ||
          !purchasedCursusIds.includes(String(p.lesson.cursus)))
    )
    .map((p) => ({
      id: p.lesson._id,
      title: p.lesson.title,
      cursusTitle: p.lesson.cursus?.title || null,
    }));

  res.render("main/dashboard", {
    userCursus: data,
    userLessons: individualLessons,
    pageStylesheet: "main/dashboard",
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

      hasCursus = purchases.some((p) => p.cursus?.toString() === cursusId);
      purchasedLessonIds = purchases
        .filter((p) => p.lesson)
        .map((p) => p.lesson.toString());

      const progress = await LessonProgress.find({
        user: userId,
        lesson: { $in: allLessons.map((l) => l._id) },
        isCompleted: true,
      });

      completedLessonIds = progress.map((p) => p.lesson.toString());

      certif = await Certification.findOne({ user: userId, cursus: cursusId });
    } catch (sessionErr) {}

    res.render("main/cursus-details", {
      cursus,
      allLessons,
      hasCursus,
      purchasedLessonIds,
      completedLessonIds,
      certif,
      pageStylesheet: "main/cursus-detail",
    });
  } catch (err) {
    console.error("Erreur affichage cursus :", err);
    res.status(500).render("error", {
      message: "Erreur lors du chargement du cursus.",
      error: err,
    });
  }
};
