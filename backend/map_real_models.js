const db = require('./config/db');

// Map specific menu names to our newly downloaded models
const modelMap = {
    'Avocado Toast': '/models/Avocado.glb',
    // Fallback others to a more sophisticated model than the red box
    'default': '/models/Hamburger.glb' 
};

// First, set everything to the new Hamburger (Fox in disguise!)
db.query('UPDATE menu SET model_url = ? WHERE model_url IS NOT NULL', [modelMap.default], (err, res) => {
    if (err) throw err;
    console.log(`Set ${res.affectedRows} items to default Hamburger AR model.`);
    
    // Then specifically override any that match our custom list
    const specificItems = Object.keys(modelMap).filter(k => k !== 'default');
    let completed = 0;
    
    if (specificItems.length === 0) {
        process.exit();
    }

    specificItems.forEach(itemName => {
        db.query('UPDATE menu SET model_url = ? WHERE name LIKE ?', [modelMap[itemName], `%${itemName}%`], (err, updateRes) => {
            if (err) console.error("Error updating:", itemName, err);
            else console.log(`Override successful for ${itemName}: ${updateRes.affectedRows} rows affected.`);
            
            completed++;
            if (completed === specificItems.length) {
                console.log("Database AR mapping complete.");
                process.exit();
            }
        });
    });
});
