const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  documentUrl: String,
  textContent: String,
  price: { type: Number, required: true },
  cursus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cursus",
    required: true,
  },
});

module.exports = mongoose.model("Lesson", lessonSchema);
