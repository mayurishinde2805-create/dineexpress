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
      FROM menu`;
  
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
    const sql = `INSERT INTO menu (name, description, price, category, sub_category, image_url, variants, type, diet, is_available) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [name, description, price, category, sub_category, image_url, JSON.stringify(variants || []), type, diet || 'veg', is_available !== false ? 1 : 0], (err, result) => {
        if (err) return res.status(500).send(err);
        if (req.io) req.io.emit('menuUpdated');
        res.json({ message: "Menu Item Added", id: result.insertId });
    });
};

exports.updateMenuItem = (req, res) => {
    const id = req.params.id || req.body.id;
    const { name, description, price, category, category_en, sub_category, sub_category_en, image_url, variants, type, diet, is_available } = req.body;
    
    // Prioritize English Original for the raw columns (prevents corruption from translated Admin UI)
    const finalCat = category_en || category;
    const finalSub = sub_category_en || sub_category;

    const sql = `UPDATE menu SET name=?, description=?, price=?, category=?, sub_category=?, image_url=?, variants=?, type=?, diet=?, is_available=? 
                 WHERE id=?`;
    db.query(sql, [name, description, price, finalCat, finalSub, image_url, JSON.stringify(variants || []), type, diet || 'veg', is_available !== false ? 1 : 0, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (req.io) req.io.emit('menuUpdated');
        res.json({ message: "Menu Item Updated" });
    });
};


exports.deleteMenuItem = (req, res) => {
    const id = req.params.id || req.body.id;
    const sql = "DELETE FROM menu WHERE id=?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (req.io) req.io.emit('menuUpdated');
        res.json({ message: "Menu Item Deleted" });
    });
};

exports.debugRaw = (req, res) => {
  const db = require('../config/db');
  db.query("SELECT COUNT(*) as total FROM menu", (errCount, countRes) => {
    db.query("SELECT * FROM menu LIMIT 5", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        db.query("SHOW TABLES", (err2, tables) => {
          res.json({ 
            env_db_name: process.env.DB_NAME || "Not Set", 
            tables: tables, 
            sample_items: result,
            count: result.length,
            total_items: countRes && countRes[0] ? countRes[0].total : 0
          });
        });
      });
  });
};

exports.emergencyReseed = (req, res) => {
  const path = require('path');
  try {
      const secret = req.query.secret;
      if (secret !== 'dine_seed_2026') return res.status(401).send("Unauthorized");
      
      const root = path.join(__dirname, '..');
      const { seedMenu } = require(path.join(root, 'seed_complete_menu'));
      const { updateTranslations } = require(path.join(root, 'seed_multilang'));
      const { diversifyPrices } = require(path.join(root, 'patch_prices'));
      const { setupTables } = require(path.join(root, 'setup_qr_tables'));

      seedMenu((err1) => {
          if (err1) return res.status(500).json({ error: "Step 1 Failed", details: err1 });
          updateTranslations((err2) => {
              if (err2) return res.status(500).json({ error: "Step 2 Failed", details: err2 });
              diversifyPrices((err3) => {
                  if (err3) return res.status(500).json({ error: "Step 3 Failed", details: err3 });
                  setupTables((err4) => {
                      if (err4) return res.status(500).json({ error: "Step 4 Failed", details: err4 });
                      res.json({ message: "Production Ecosystem FULL Success! 🥘🚀📊" });
                  });
              });
          });
      });
  } catch (err) {
      res.status(500).json({ error: err.message, stack: err.stack });
  }
};