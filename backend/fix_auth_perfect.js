const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'controllers', 'authController.js');
let code = fs.readFileSync(filePath, 'utf8');

let startIndex = 0;
let replaceCount = 0;

while (true) {
    let sendIndex = code.indexOf('sendEmail(email, otp);', startIndex);
    if (sendIndex === -1) break;

    // Find the enclosing query callback and replace it
    let errIndex = code.lastIndexOf('(err) => {', sendIndex);
    if (errIndex !== -1 && errIndex > (sendIndex - 1000)) { // sanity check
        // Ensure we don't add async if it's already there
        const prevText = code.substring(errIndex - 6, errIndex);
        if (!prevText.includes('async')) {
            code = code.substring(0, errIndex) + 'async ' + code.substring(errIndex);
            sendIndex += 6; 
        }
    }

    // Replace the sendEmail call
    let replaceStr = `try {
        await sendEmail(email, otp);
      } catch (mailErr) {
        console.error("Mail Error:", mailErr);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }`;

    code = code.substring(0, sendIndex) + replaceStr + code.substring(sendIndex + 'sendEmail(email, otp);'.length);
    startIndex = sendIndex + replaceStr.length;
    replaceCount++;
}

fs.writeFileSync(filePath, code);
console.log("Replaced instances:", replaceCount);
