const express = require('express');
const router = express.Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, debugRaw } = require('../controllers/menuController');
const { adminAuth } = require('../middleware/authMiddleware');

// Public routes
router.get('/all', getMenu);
router.get('/debug-raw', debugRaw);
router.get('/reseed-prod-emergency', (req, res) => {
    try {
        const secret = req.query.secret;
        if (secret !== 'dine_seed_2026') return res.status(401).send("Unauthorized");
        
        console.log("Loading modules for emergency reseed...");
        const { seedMenu } = require('../seed_complete_menu');
        const { updateTranslations } = require('../seed_multilang');
        const { diversifyPrices } = require('../patch_prices');

        console.log("Starting Emergency Native Reseed...");

        seedMenu((err1) => {
            if (err1) return res.status(500).json({ error: "Step 1 (Menu Seed) Failed", details: err1.message || err1 });
            
            updateTranslations((err2) => {
                if (err2) return res.status(500).json({ error: "Step 2 (Translation) Failed", details: err2.message || err2 });
                
                diversifyPrices((err3) => {
                    if (err3) return res.status(500).json({ error: "Step 3 (Price Patch) Failed", details: err3.message || err3 });
                    
                    res.json({ message: "Production Database Native Reseed Success! 🥘🚀" });
                });
            });
        });
    } catch (err) {
        console.error("Emergency Reseed Route Error:", err);
        res.status(500).json({ error: "Route Execution Crash", details: err.message, stack: err.stack });
    }
});




// Admin-protected routes (RESTful)
router.post('/', adminAuth, addMenuItem);  // Add
router.put('/:id', adminAuth, updateMenuItem); // Update
router.delete('/:id', adminAuth, deleteMenuItem); // Delete


module.exports = router;
