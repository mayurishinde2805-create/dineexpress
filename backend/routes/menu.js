const express = require('express');
const router = express.Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, debugRaw, emergencyReseed } = require('../controllers/menuController');
const { adminAuth } = require('../middleware/authMiddleware');

// Public routes
router.get('/all', getMenu);
router.get('/debug-raw', debugRaw);
router.get('/debug-files', debugFiles);
router.get('/reseed-prod-emergency', emergencyReseed);




// Admin-protected routes (RESTful)
router.post('/', adminAuth, addMenuItem);  // Add
router.put('/:id', adminAuth, updateMenuItem); // Update
router.delete('/:id', adminAuth, deleteMenuItem); // Delete


module.exports = router;
