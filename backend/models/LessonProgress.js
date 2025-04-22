const mongoose = require("mongoose");

const lessonProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
});

module.exports = mongoose.model("LessonProgress", lessonProgressSchema);
