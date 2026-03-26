const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const frontendImg = path.join(__dirname, 'frontend/public/images');
const backendImg = path.join(__dirname, 'backend/public/images');
const frontendModels = path.join(__dirname, 'frontend/public/models');
const backendModels = path.join(__dirname, 'backend/public/models');

console.log("🚚 Copying assets...");
if (fs.existsSync(frontendImg)) {
    copyRecursiveSync(frontendImg, backendImg);
    console.log("✅ Images copied to backend/public/images");
}
if (fs.existsSync(frontendModels)) {
    copyRecursiveSync(frontendModels, backendModels);
    console.log("✅ Models copied to backend/public/models");
}
