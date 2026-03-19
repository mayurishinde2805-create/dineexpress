const db = require('./config/db');
db.query("SELECT DISTINCT category, sub_category FROM menu ORDER BY category, sub_category", (err, res) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    const tree = {};
    res.forEach(r => {
        if (!tree[r.category]) tree[r.category] = [];
        tree[r.category].push(r.sub_category);
    });
    console.log(JSON.stringify(tree, null, 2));
    process.exit();
});
