const { body } = require("express-validator");

module.exports = [
  body("*").trim().escape()
];
