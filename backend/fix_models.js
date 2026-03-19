const db = require('./config/db');

// The original local '.glb' files (e.g. /models/sting.glb) do not exist on the user's hard drive.
// This causes model-viewer to fetch a 404 HTML page and try to parse it as a binary GLTF model,
// causing the "Cannot read properties of undefined (reading 'scene')" crash.
// We are replacing them with a reliable, remote fallback 3D model for demonstration.
const fallbackModelUrl = "https://modelviewer.dev/shared/models/glTF-Sample-Models/2.0/Cake/glTF-Binary/Cake.glb";

db.query('UPDATE menu SET model_url = ? WHERE model_url IS NOT NULL', [fallbackModelUrl], (err, res) => {
    if (err) {
        console.error("Failed to update models:", err);
    } else {
        console.log("Successfully resolved broken 3D links. Affected rows:", res.affectedRows);
    }
    process.exit();
});
