const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Theme", themeSchema);
