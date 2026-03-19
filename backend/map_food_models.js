const db = require('./config/db');

// Map specific menu names to our newly downloaded real AR models
const modelMap = {
    'Burger': '/models/Burger.glb',
    'Sandwich': '/models/Burger.glb',
    'Avocado': '/models/Avocado.glb',
    'Salad': '/models/Avocado.glb',
    // Fallback others to Burger instead of Fox for a better general food experience
    'default': '/models/Burger.glb' 
};

// First, set everything to the new default (Burger)
db.query('UPDATE menu SET model_url = ? WHERE model_url IS NOT NULL', [modelMap.default], (err, res) => {
    if (err) throw err;
    console.log(`Set ${res.affectedRows} items to default Burger AR model.`);
    
    const specificItems = Object.keys(modelMap).filter(k => k !== 'default');
    let completed = 0;

    specificItems.forEach(itemName => {
        db.query('UPDATE menu SET model_url = ? WHERE name LIKE ?', [modelMap[itemName], `%${itemName}%`], (err, updateRes) => {
            if (err) console.error("Error updating:", itemName, err);
            else console.log(`Override successful for ${itemName}: ${updateRes.affectedRows} rows affected.`);
            
            completed++;
            if (completed === specificItems.length) {
                console.log("Database AR mapping complete. Fox replaced with Food.");
                process.exit();
            }
        });
    });
});
