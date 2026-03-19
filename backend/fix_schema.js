// Database Schema Verification and Fix Script
const db = require('./config/db');

console.log('🔧 Checking and Fixing Database Schema...\n');

// Check if admin_code and kitchen_code columns exist
db.query(`
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'dineexpress' 
    AND TABLE_NAME = 'users' 
    AND COLUMN_NAME IN ('admin_code', 'kitchen_code')
`, (err, columns) => {
    if (err) {
        console.error('❌ Error checking schema:', err);
        process.exit(1);
    }

    const hasAdminCode = columns.some(c => c.COLUMN_NAME === 'admin_code');
    const hasKitchenCode = columns.some(c => c.COLUMN_NAME === 'kitchen_code');

    console.log('Schema Check:');
    console.log(`- admin_code column: ${hasAdminCode ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`- kitchen_code column: ${hasKitchenCode ? '✅ EXISTS' : '❌ MISSING'}`);

    if (!hasAdminCode || !hasKitchenCode) {
        console.log('\n🔨 Adding missing columns...\n');

        const alterQueries = [];
        if (!hasAdminCode) {
            alterQueries.push("ALTER TABLE users ADD COLUMN admin_code VARCHAR(20) DEFAULT NULL");
        }
        if (!hasKitchenCode) {
            alterQueries.push("ALTER TABLE users ADD COLUMN kitchen_code VARCHAR(20) DEFAULT NULL");
        }

        let completed = 0;
        alterQueries.forEach((query, index) => {
            db.query(query, (err) => {
                if (err) {
                    console.error(`❌ Error adding column:`, err);
                } else {
                    console.log(`✅ Column added successfully`);
                }
                completed++;
                if (completed === alterQueries.length) {
                    console.log('\n✅ Schema fix complete!');
                    checkUsers();
                }
            });
        });
    } else {
        console.log('\n✅ Schema is correct!');
        checkUsers();
    }
});

function checkUsers() {
    console.log('\n📊 Checking User Status...\n');

    db.query(`
        SELECT email, role, admin_code, kitchen_code, is_verified 
        FROM users 
        WHERE role IN ('admin', 'kitchen')
        ORDER BY created_at DESC
    `, (err, users) => {
        if (err) {
            console.error('❌ Error:', err);
            process.exit(1);
        }

        if (users.length === 0) {
            console.log('ℹ️  No admin/kitchen users found.');
            console.log('\n💡 Register at:');
            console.log('   - http://localhost:3000/admin/register');
            console.log('   - http://localhost:3000/kitchen/register');
            process.exit(0);
        }

        users.forEach(user => {
            console.log(`\n📧 ${user.email} (${user.role.toUpperCase()})`);
            console.log(`   Verified: ${user.is_verified ? '✅' : '❌'}`);

            if (user.role === 'admin') {
                if (user.admin_code) {
                    console.log(`   Code: ✅ ${user.admin_code}`);
                    console.log(`   Status: 🟢 Ready to login`);
                } else {
                    console.log(`   Code: ❌ NULL`);
                    console.log(`   Action: Complete OTP verification or use "Forgot Code?"`);
                }
            } else if (user.role === 'kitchen') {
                if (user.kitchen_code) {
                    console.log(`   Code: ✅ ${user.kitchen_code}`);
                    console.log(`   Status: 🟢 Ready to login`);
                } else {
                    console.log(`   Code: ❌ NULL`);
                    console.log(`   Action: Complete OTP verification or use "Forgot Code?"`);
                }
            }
        });

        console.log('\n' + '─'.repeat(60));
        console.log('\n💡 To get your code:');
        console.log('   1. Complete registration + OTP verification');
        console.log('   2. OR use "Forgot Code?" on login page\n');

        process.exit(0);
    });
}
