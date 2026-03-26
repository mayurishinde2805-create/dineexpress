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
    
    // Check if the file contains the hardcoded IP
    if (code.includes('http://192.168.1.113:4000')) {
        
        // 1. Replace axios and fetch URL strings
        code = code.replace(/['"]http:\/\/192\.168\.1\.113:4000(.*?)['"]/g, 'API_BASE_URL + "$1"');
        code = code.replace(/`http:\/\/192\.168\.1\.113:4000(.*?)`/g, '`${API_BASE_URL}$1`');
        
        // 2. Replace io() direct instantiations
        code = code.replace(/io\(API_BASE_URL \+ ""\)/g, 'io(API_BASE_URL)');
        
        // 3. Ensure API_BASE_URL is imported if it was utilized by our replacements
        if (!original.includes('import API_BASE_URL')) {
            // Determine relative path depth to inject import
            const relPath = path.relative(path.dirname(file), path.join(__dirname, 'frontend', 'src', 'apiConfig'));
            let importPath = relPath.replace(/\\/g, '/');
            if (!importPath.startsWith('.')) importPath = './' + importPath;
            
            code = `import API_BASE_URL from "${importPath}";\n` + code;
        }

        fs.writeFileSync(file, code);
        console.log("Patched API endpoints bridging in:", path.basename(file));
    }
});
console.log("End-to-End Three-Panel Dashboard Ecosystem is now universally synchronized!");
