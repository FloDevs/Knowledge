const express = require("express");
const router = express.Router();
const validationMiddleware = require("../middlewares/validationMiddleware");
const { validateRequest } = validationMiddleware;
const authController = require("../controllers/authController");

// VUES (GET)
router.get('/register', (req, res) => {
  res.render('auth/register', { message: req.query.message });
});

router.get('/login', (req, res) => {
  res.render('auth/login', { message: req.query.message });
});

router.get('/confirm', authController.confirmEmail);

router.post(
  '/register',
  validateRequest([
    validationMiddleware.validateName,
    validationMiddleware.validateEmail,
    validationMiddleware.validatePassword,
  ]),
  authController.register
);

router.post(
  '/login',
  validateRequest([
    validationMiddleware.validateEmail,
    validationMiddleware.validatePassword,
  ]),
  authController.login
);

router.get("/logout", authController.logout);

module.exports = router;
