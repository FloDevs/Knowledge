const LessonProgress = require("../models/LessonProgress");
const Lesson = require("../models/Lesson");
const Cursus = require("../models/Cursus");
const Certification = require("../models/Certification");

exports.markLessonCompleted = async (req, res) => {
  try {
    const { userId } = req; // from auth
    const { lessonId } = req.body;

    // Mettre à jour ou créer la progression
    let progress = await LessonProgress.findOne({ user: userId, lesson: lessonId });
    if (!progress) {
      progress = await LessonProgress.create({
        user: userId,
        lesson: lessonId,
        isCompleted: true,
        completedAt: new Date()
      });
    } else {
      progress.isCompleted = true;
      progress.completedAt = new Date();
      await progress.save();
    }

    // Vérifier si toutes les leçons du cursus sont complétées
    const lesson = await Lesson.findById(lessonId);
    const allLessons = await Lesson.find({ cursus: lesson.cursus });
    const allLessonIds = allLessons.map(l => l._id.toString());

    const completedLessons = await LessonProgress.find({
      user: userId,
      lesson: { $in: allLessonIds },
      isCompleted: true
    });

    // Si toutes les leçons du cursus sont complétées => Certification
    if (completedLessons.length === allLessons.length) {
      // Vérifier si certification déjà existante
      const existingCertif = await Certification.findOne({
        user: userId,
        cursus: lesson.cursus
      });
      if (!existingCertif) {
        await Certification.create({
          user: userId,
          cursus: lesson.cursus,
          issuedAt: new Date()
        });
      }
    }

    res.json({ message: "Lesson marked as completed", progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer la progression d'un utilisateur sur un cursus
exports.getCursusProgress = async (req, res) => {
  try {
    const { userId } = req; // from auth
    const { cursusId } = req.params;

    // Récupérer toutes les leçons du cursus
    const lessons = await Lesson.find({ cursus: cursusId });
    const lessonIds = lessons.map(l => l._id);
    
    // Récupérer la progression
    const progressData = await LessonProgress.find({
      user: userId,
      lesson: { $in: lessonIds }
    });

    res.json({ lessons, progressData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
