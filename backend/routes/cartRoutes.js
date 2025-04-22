const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/add/:id", isAuthenticated, cartController.addToCart);
router.post("/remove/:id", isAuthenticated, cartController.removeFromCart);
router.get("/", isAuthenticated, cartController.showCart);
router.post("/checkout", isAuthenticated, cartController.checkoutCart);

module.exports = router;
