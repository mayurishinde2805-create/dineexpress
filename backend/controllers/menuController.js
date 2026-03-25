const db = require('../config/db');

exports.getMenu = (req, res) => {
  // Fix: Default to "All" if category param is missing (for /api/menu/all)
  const category = req.params.category || "All";
  const { lang } = req.query;

  console.log(`[MENU] Fetching category: ${category} | Language: ${lang}`);

  const sql = `SELECT id, 
      COALESCE(name_mr, name) AS name, 
      COALESCE(description_mr, description) AS description,
      category AS category_en,
      COALESCE(category_mr, category) AS category,
      sub_category AS sub_category_en,
      COALESCE(sub_category_mr, sub_category) AS sub_category,
      price, image_url, diet, 
      COALESCE(variants_mr, variants) AS variants 
      FROM menu_items 
      WHERE (category = ? OR ? = 'All')`;

  db.query(sql, [category, category], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json(result);
  });
};

exports.addMenuItem = (req, res) => {
    const { name, description, price, category, sub_category, image_url, variants, type, diet, is_available } = req.body;
    const sql = `INSERT INTO menu_items (name, description, price, category, sub_category, image_url, variants, type, diet, is_available) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [name, description, price, category, sub_category, image_url, JSON.stringify(variants || []), type, diet || 'veg', is_available !== false ? 1 : 0], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Menu Item Added", id: result.insertId });
    });
};

exports.updateMenuItem = (req, res) => {
    const id = req.params.id || req.body.id;
    const { name, description, price, category, sub_category, image_url, variants, type, diet, is_available } = req.body;
    const sql = `UPDATE menu_items SET name=?, description=?, price=?, category=?, sub_category=?, image_url=?, variants=?, type=?, diet=?, is_available=? 
                 WHERE id=?`;
    db.query(sql, [name, description, price, category, sub_category, image_url, JSON.stringify(variants || []), type, diet || 'veg', is_available !== false ? 1 : 0, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Menu Item Updated" });
    });
};

exports.deleteMenuItem = (req, res) => {
    const id = req.params.id || req.body.id;
    const sql = "DELETE FROM menu_items WHERE id=?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Menu Item Deleted" });
    });
};
