const express = require('express');
const router = express.Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, debugRaw } = require('../controllers/menuController');
const { adminAuth } = require('../middleware/authMiddleware');

// Public routes
router.get('/all', getMenu);
router.get('/debug-raw', debugRaw);
router.get('/reseed-prod-emergency', (req, res) => {
    // Only allow if a specific secret header or param is provided (just in case)
    const secret = req.query.secret;
    if (secret !== 'dine_seed_2026') return res.status(401).send("Unauthorized");
    
    const { exec } = require('child_process');
    // Run the seed scripts sequentially
    exec('node backend/seed_complete_menu.js && node backend/seed_multilang.js && node backend/patch_prices.js', (err, stdout, stderr) => {
        if (err) return res.status(500).json({ error: err.message, stderr });
        res.json({ message: "Production Database Re-Seeded Successfully!", stdout });
    });
});

// Admin-protected routes (RESTful)
router.post('/', adminAuth, addMenuItem);  // Add
router.put('/:id', adminAuth, updateMenuItem); // Update
router.delete('/:id', adminAuth, deleteMenuItem); // Delete


module.exports = router;
