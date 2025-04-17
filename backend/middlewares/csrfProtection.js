const csrf = require("csurf");

const csrfProtection = csrf();

module.exports = csrfProtection;
