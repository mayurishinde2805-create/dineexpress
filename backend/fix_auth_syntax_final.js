const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'controllers', 'authController.js');

let code = fs.readFileSync(file, 'utf8');
const regex = /res\.json\((.*?)\}\s*catch\s*\(mailErr\)\s*\{/g;

code = code.replace(regex, (match, innerJson) => {
    return `res.json(${innerJson}});
      } catch (mailErr) {`;
});

fs.writeFileSync(file, code);
console.log("Syntax repair executed");
