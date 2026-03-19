const db = require('./config/db');

const updates = [
    { name: 'Tandoori Chicken', url: '/images/3d/starter.png' },
    { name: 'Chicken Lollipop', url: '/images/3d/starter.png' },
    { name: 'Fish Fingers', url: '/images/3d/starter.png' },
    { name: 'Butter Chicken', url: '/images/3d/main.png' },
    { name: 'Chicken Tikka Masala', url: '/images/3d/main.png' },
    { name: 'Veg Kolhapuri', url: '/images/3d/main.png' },
    { name: 'Chocolate Lava Cake', url: '/images/3d/dessert.png' }
];

let completed = 0;
updates.forEach(item => {
    db.query('UPDATE menu SET image_url = ? WHERE name = ?', [item.url, item.name], (err, res) => {
        completed++;
        if (err) console.error(`Failed ${item.name}:`, err);
        else console.log(`Updated ${item.name} to ${item.url}`);

        if (completed === updates.length) {
            console.log("All generic 3D mappings completed.");
            process.exit();
        }
    });
});
