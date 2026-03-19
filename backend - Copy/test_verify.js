const http = require('http');

const data = JSON.stringify({
    email: "test1767414447715@example.com",
    otp: "891359"
});

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/auth/verify-otp',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Body: ${body}`);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request:`, e);
});

req.write(data);
req.end();
