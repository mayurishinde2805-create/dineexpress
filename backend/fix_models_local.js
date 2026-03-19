const db = require('./config/db');

// The original local '.glb' files (e.g. /models/sting.glb) do not exist on the user's hard drive.
// We are replacing them with a reliable, local fallback 3D model for demonstration.
const fallbackModelUrl = "/models/test_model.glb";

db.query('UPDATE menu SET model_url = ? WHERE model_url IS NOT NULL', [fallbackModelUrl], (err, res) => {
    if (err) {
        console.error("Failed to update models:", err);
    } else {
        console.log("Successfully resolved broken 3D links. Affected rows:", res.affectedRows);
    }
    process.exit();
});
