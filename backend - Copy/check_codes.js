const db = require('./config/db');

console.log('\n=== Checking User Codes ===\n');

db.query(`
    SELECT 
        email, 
        role, 
        admin_code, 
        kitchen_code, 
        is_verified 
    FROM users 
    WHERE role IN ('admin', 'kitchen')
    ORDER BY created_at DESC
`, (err, users) => {
    if (err) {
        console.error('Error:', err);
        process.exit(1);
    }

    if (users.length === 0) {
        console.log('No admin/kitchen users found.');
        process.exit(0);
    }

    users.forEach(user => {
        console.log(`\nEmail: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`Verified: ${user.is_verified ? 'Yes' : 'No'}`);

        if (user.role === 'admin') {
            console.log(`Admin Code: ${user.admin_code || 'NULL'}`);
            if (user.admin_code) {
                console.log(`✅ Use this code to login: ${user.admin_code}`);
            } else {
                console.log(`❌ No code - complete OTP verification`);
            }
        } else if (user.role === 'kitchen') {
            console.log(`Kitchen Code: ${user.kitchen_code || 'NULL'}`);
            if (user.kitchen_code) {
                console.log(`✅ Use this code to login: ${user.kitchen_code}`);
            } else {
                console.log(`❌ No code - complete OTP verification`);
            }
        }
        console.log('---');
    });

    process.exit(0);
});
