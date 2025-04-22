const LessonProgress = require("../models/LessonProgress");
const Lesson = require("../models/Lesson");
const Cursus = require("../models/Cursus");
const Certification = require("../models/Certification");

exports.markLessonCompleted = async (req, res) => {
  try {
    const userId = req.session?.user?._id;
    const { lessonId } = req.body;

    // Update or create progress
    let progress = await LessonProgress.findOne({
      user: userId,
      lesson: lessonId,
    });
    if (!progress) {
      progress = await LessonProgress.create({
        user: userId,
        lesson: lessonId,
        isCompleted: true,
        completedAt: new Date(),
      });
    } else {
      progress.isCompleted = true;
      progress.completedAt = new Date();
      await progress.save();
    }

    const lesson = await Lesson.findById(lessonId);
    const allLessons = await Lesson.find({ cursus: lesson.cursus });
    const allLessonIds = allLessons.map((l) => l._id.toString());

    const completedLessons = await LessonProgress.find({
      user: userId,
      lesson: { $in: allLessonIds },
      isCompleted: true,
    });

    // All lessons complete => Certification
    if (completedLessons.length === allLessons.length) {
      const existingCertif = await Certification.findOne({
        user: userId,
        cursus: lesson.cursus,
      });
      if (!existingCertif) {
        await Certification.create({
          user: userId,
          cursus: lesson.cursus,
          issuedAt: new Date(),
        });
      }
    }

    res.redirect(`/cursus/${lesson.cursus}?message=Leçon complétée`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCursusProgress = async (req, res) => {
  try {
    const userId = req.session?.user?._id;
    const { cursusId } = req.params;

    const lessons = await Lesson.find({ cursus: cursusId });
    const lessonIds = lessons.map((l) => l._id);

    const progressData = await LessonProgress.find({
      user: userId,
      lesson: { $in: lessonIds },
    });

    res.json({ lessons, progressData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
