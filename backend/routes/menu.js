const express = require('express');
const router = express.Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, debugRaw } = require('../controllers/menuController');
const { adminAuth } = require('../middleware/authMiddleware');

// Public routes
router.get('/all', getMenu);
router.get('/debug-raw', debugRaw);

// Admin-protected routes
router.post('/add', adminAuth, addMenuItem);
router.post('/update', adminAuth, updateMenuItem);
router.post('/delete', adminAuth, deleteMenuItem);

module.exports = router;
