const fs = require('fs');
const path = require('path');

const imagesDir = 'C:/Users/MAYURI/OneDrive/Desktop/DineExpress/frontend/public/images';
const files = fs.readdirSync(imagesDir);

const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

const imageMaps = {};
files.forEach(file => {
    if (fs.statSync(path.join(imagesDir, file)).isFile()) {
        const ext = path.extname(file);
        const name = path.basename(file, ext);
        imageMaps[normalize(name)] = file;
    }
});

// We will get the items from a manual list or query result
// Since I can't easily iterate and query in one go, I'll generate a general UPDATE statement logic
console.log("-- SQL Update Script");
Object.keys(imageMaps).forEach(normName => {
    const filename = imageMaps[normName];
    // This is a heuristic match
    console.log(`UPDATE menu SET image_url = '/images/${filename}' WHERE REPLACE(LOWER(name), ' ', '') = '${normName}' AND (image_url NOT LIKE '/images/%' OR image_url IS NULL OR image_url = '');`);
});
