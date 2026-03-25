const express = require('express');
const router = express.Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { adminAuth } = require('../middleware/authMiddleware');

router.get('/all', getMenu);
router.get('/debug-raw', menuController.debugRaw);
router.post('/add', addMenuItem);
router.post('/update', updateMenuItem);
router.post('/delete', deleteMenuItem);

// RESTful routes (kept for new components if used)
router.post('/', adminAuth, addMenuItem);
router.put('/:id', adminAuth, updateMenuItem);
router.delete('/:id', adminAuth, deleteMenuItem);

module.exports = router;
