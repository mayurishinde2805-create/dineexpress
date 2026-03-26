const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'controllers', 'authController.js');
let code = fs.readFileSync(filePath, 'utf8');

// Fix double async
code = code.replace(/async\s+async/g, 'async');

// Ensure all "await sendEmail(email, otp);" exist. Wait, the previous script might have added them. Let's make sure.
// Let's print out the number of sendEmail matches to verify.
const matches = code.match(/await sendEmail/g);
console.log('await sendEmail count:', matches ? matches.length : 0);

fs.writeFileSync(filePath, code);
console.log('Syntax cleanup done.');
