const express = require('express');
const adminController = require ('../controllers/adminController');
const { isAdmin } = require("../middlewares");
const { isAuthenticated } = require("../middlewares");
const router = express.Router();

router.use(isAuthenticated, isAdmin);
router.get('/dashboard', adminController.renderDashboard);
router.get('/cursus',  adminController.renderCursusPage);  
router.get('/users', adminController.renderUsersPage);
router.get('/orders', adminController.renderOrdersPage);  

module.exports = router;
