const Lesson = require("../models/Lesson");

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

// GET ALL
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({}).populate("cursus");
    res.json(lessons);
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
