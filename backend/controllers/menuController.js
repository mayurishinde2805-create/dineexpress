const db = require('../config/db');

exports.getMenu = (req, res) => {
  const category = req.params.category || "All";
  const { lang } = req.query;

  let sql = `SELECT id, 
      COALESCE(name_mr, name) AS name, 
      COALESCE(description_mr, description) AS description,
      category AS category_en,
      COALESCE(category_mr, category) AS category,
      sub_category AS sub_category_en,
      COALESCE(sub_category_mr, sub_category) AS sub_category,
      price, image_url, diet, 
      COALESCE(variants_mr, variants) AS variants 
      FROM menu_items`;
  
  let params = [];
  if (category && category !== "All") {
    sql += " WHERE category = ?";
    params.push(category);
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("DB Query Error:", err);
      return res.status(500).json({ error: err.message });
    }
    // Return result directly as an array (expect by frontend)
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

exports.debugRaw = (req, res) => {
  const db = require('../config/db');
  db.query("SELECT * FROM menu_items LIMIT 5", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("SHOW TABLES", (err2, tables) => {
      res.json({ 
        env_db_name: process.env.DB_NAME || "Not Set", 
        tables: tables, 
        sample_items: result,
        count: result.length
      });
    });
  });
};