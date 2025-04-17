const { body, param, validationResult } = require("express-validator");

exports.validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};

exports.validateName = body("name")
  .isLength({ min: 3 })
  .withMessage("Le nom doit contenir au moins 3 caractères.")
  .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
  .withMessage(
    "Le nom ne doit contenir que des lettres, espaces, apostrophes ou tirets."
  )
  .notEmpty()
  .withMessage("Le nom est obligatoire.");

exports.validateEmail = body("email")
  .isEmail()
  .withMessage("L'email doit être valide.");

exports.validatePassword = body("password")
  .isLength({ min: 6 })
  .withMessage("Le mot de passe doit contenir au moins 6 caractères.");
