const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cursus: { type: mongoose.Schema.Types.ObjectId, ref: "Cursus" },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Purchase", purchaseSchema);
