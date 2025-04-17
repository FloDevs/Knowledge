const mongoose = require("mongoose");

const cursusSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  theme: { type: mongoose.Schema.Types.ObjectId, ref: "Theme", required: true },
  featured: { type: Boolean, default: false } ,
});

module.exports = mongoose.model("Cursus", cursusSchema);
