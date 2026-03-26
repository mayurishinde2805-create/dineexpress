const db = require('../config/db');

exports.getMenu = (req, res) => {
  const { lang } = req.query; // 'en', 'mr', 'hi'
  const category = req.params.category || "All";

  // Dynamic Column Selection based on Language
  let nameCol = "name";
  let descCol = "description";
  let catDisplayCol = "category";
  let subCatDisplayCol = "sub_category";
  let variantsCol = "variants";

  if (lang === 'mr') {
    nameCol = "COALESCE(name_mr, name)";
    descCol = "COALESCE(description_mr, description)";
    catDisplayCol = "COALESCE(category_mr, category)";
    subCatDisplayCol = "COALESCE(sub_category_mr, sub_category)";
    variantsCol = "COALESCE(variants_mr, variants)";
  } else if (lang === 'hi') {
    nameCol = "COALESCE(name_hi, name)";
    descCol = "COALESCE(description_hi, description)";
    catDisplayCol = "COALESCE(category_hi, category)";
    subCatDisplayCol = "COALESCE(sub_category_hi, sub_category)";
    variantsCol = "COALESCE(variants_hi, variants)";
  }

  let sql = `SELECT id, price, image_url, diet,
      ${nameCol} AS name,
      ${descCol} AS description,
      category AS category_en,
      ${catDisplayCol} AS category,
      sub_category AS sub_category_en,
      ${subCatDisplayCol} AS sub_category,
      ${variantsCol} AS variants 
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
    res.json(result);
  });
};

exports.addMenuItem = (req, res) => {
    const { name, description, price, category, sub_category, image_url, variants, type, diet, is_available } = req.body;
    const sql = `INSERT INTO menu_items (name, description, price, category, sub_category, image_url, variants, type, diet, is_available) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [name, description, price, category, sub_category, image_url, JSON.stringify(variants || []), type, diet || 'veg', is_available !== false ? 1 : 0], (err, result) => {
        if (err) return res.status(500).send(err);
        if (req.io) req.io.emit('menuUpdated');
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
        if (req.io) req.io.emit('menuUpdated');
        res.json({ message: "Menu Item Updated" });
    });
};

exports.deleteMenuItem = (req, res) => {
    const id = req.params.id || req.body.id;
    const sql = "DELETE FROM menu_items WHERE id=?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (req.io) req.io.emit('menuUpdated');
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