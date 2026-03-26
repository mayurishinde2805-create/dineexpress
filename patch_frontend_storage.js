const fs = require('fs');
const path = require('path');

function walk(dir) {
    let files = [];
    for (const f of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory() && f !== 'node_modules') {
            files = files.concat(walk(fullPath));
        } else if (f.endsWith('.jsx') || f.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    return files;
}

const files = walk(path.join(__dirname, 'frontend', 'src'));
files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    let original = code;
    
    // Pattern 1: JSON.parse(localStorage.getItem("key") || "{}")
    code = code.replace(/JSON\.parse\(localStorage\.getItem\((['"])(.*?)\1\)\s*\|\|\s*(['"])(.*?)\1\)/g, 
        "( (() => { try { return JSON.parse(localStorage.getItem($1$2$1)) || JSON.parse($3$4$3); } catch(e) { return JSON.parse($3$4$3); } })() )");
        
    // Pattern 2: JSON.parse(localStorage.getItem("key"))
    code = code.replace(/JSON\.parse\(localStorage\.getItem\((['"])(.*?)\1\)\)/g, 
        "( (() => { try { const val = localStorage.getItem($1$2$1); return val !== 'undefined' ? JSON.parse(val) : null; } catch(e) { return null; } })() )");
        
    if (code !== original) {
        fs.writeFileSync(file, code);
        console.log("Patched:", path.basename(file));
    }
});
console.log("Universal parsing safety applied.");
