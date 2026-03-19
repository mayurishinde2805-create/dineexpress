const db = require('./config/db');

// Map specific menu names to our newly downloaded real AR models
const modelMap = {
    'Avocado': '/models/Avocado.glb',
    'Salad': '/models/Avocado.glb',
    // Fallback others to the Fox model (a high-quality animated Khronos test model)
    'default': '/models/Fox.glb' 
};

// First, set everything to the new default (Fox)
db.query('UPDATE menu SET model_url = ? WHERE model_url IS NOT NULL', [modelMap.default], (err, res) => {
    if (err) throw err;
    console.log(`Set ${res.affectedRows} items to default Fox AR model.`);
    
    // Then specifically override any that match 'Avocado' or 'Salad'
    const specificItems = Object.keys(modelMap).filter(k => k !== 'default');
    let completed = 0;

    specificItems.forEach(itemName => {
        db.query('UPDATE menu SET model_url = ? WHERE name LIKE ?', [modelMap[itemName], `%${itemName}%`], (err, updateRes) => {
            if (err) console.error("Error updating:", itemName, err);
            else console.log(`Override successful for ${itemName}: ${updateRes.affectedRows} rows affected.`);
            
            completed++;
            if (completed === specificItems.length) {
                console.log("Database AR mapping complete. Red Box replaced.");
                process.exit();
            }
        });
    });
});
