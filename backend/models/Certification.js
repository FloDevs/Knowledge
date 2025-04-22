const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cursus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cursus",
    required: true,
  },
  issuedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Certification", certificationSchema);
