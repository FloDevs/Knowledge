const express = require("express");
const router = express.Router();
const cursusController = require("../controllers/cursusController");
const multer = require("multer");
const path = require("path");
const csrf = require("../middlewares/csrfProtection").raw;
const { isAdmin } = require("../middlewares");
const { isAuthenticated } = require("../middlewares");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/cursus");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/dashboard", isAuthenticated, cursusController.getMyCursus);
router.get("/", cursusController.getAllCursus);

router.post(
  "/create",
  isAuthenticated,
  isAdmin,
  upload.single("img"),
  csrf,
  cursusController.createCursus
);

router.get("/:id", cursusController.getCursusById);

router.put(
  "/update/:id",
  isAuthenticated,
  isAdmin,
  upload.single("img"),
  csrf,
  cursusController.updateCursus
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  isAdmin,
  cursusController.deleteCursus
);

module.exports = router;
