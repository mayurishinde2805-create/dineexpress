// Removed node-fetch dependency

// If node-fetch is not available in the environment, we might need to use standard http
// But 'node-fetch' is common. Let's try standard http to be safe since I don't see node_modules listed with details.
// Actually, I saw node_modules, but let's stick to standard node 'http' to avoid dependencies if possible, 
// OR just use a simple script with axios if installed. 
// Given I don't want to guess dependencies, I'll use standard 'http' module.

const http = require('http');

function postRequest(path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: body }));
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

async function runTest() {
    const timestamp = Date.now();
    const testUser = {
        fullname: `Test User ${timestamp}`,
        email: `test${timestamp}@example.com`,
        mobile: `${timestamp.toString().slice(-10)}`, // ensure it's not too long
        password: 'password123'
    };

    console.log("1. Registering User...");
    try {
        const regRes = await postRequest('/api/auth/register', JSON.stringify(testUser));
        console.log("Registration Response:", regRes.status, regRes.body);

        if (regRes.status !== 200) {
            console.error("Registration failed!");
            return;
        }

        // In a real scenario, we'd need to fetch the OTP from DB or email.
        // Since I have DB access (via the agent), I can query the DB to get the OTP for this email.
        // But for this script I can just print instructions or try to query DB if I could running 'node'.
        // Wait, I can't query DB from this external script easily unless I use the same DB config.
        // I will make this script PRINT the email to be used, and then I will query DB using another tool call to get the OTP.

        console.log(`\nUser registered: ${testUser.email}`);
        console.log("Please query the database to get the OTP for this email.");

    } catch (e) {
        console.error("Error:", e);
    }
}

runTest();
