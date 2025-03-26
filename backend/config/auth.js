const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: "1h",
  bcryptSaltRounds: 10,
};
