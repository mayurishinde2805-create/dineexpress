const db = require('../config/db');

exports.getMenu = (req, res) => {
    const lang = req.query.lang;
    let sql = "";

    // We select ALL columns (*) first, so original 'name', 'category', 'sub_category' are available for logic/filtering.
    // Then we select computed columns prefixed with 'display_' for UI rendering.
    if (lang === 'hi') {
        sql = `
            SELECT *,
                COALESCE(name_hi, name) as display_name, 
                COALESCE(description_hi, description) as display_description, 
                COALESCE(category_hi, category) as display_category, 
                COALESCE(sub_category_hi, sub_category) as display_sub_category,
                COALESCE(variants_hi, variants) as display_variants
            FROM menu_items
        `;
    } else if (lang === 'mr') {
        sql = `
            SELECT *,
                COALESCE(name_mr, name) as display_name, 
                COALESCE(description_mr, description) as display_description, 
                COALESCE(category_mr, category) as display_category, 
                COALESCE(sub_category_mr, sub_category) as display_sub_category,
                 COALESCE(variants_mr, variants) as display_variants
            FROM menu_items
        `;
    } else {
        // Default (English) - display_ fields map to original fields for consistency
        sql = `
            SELECT *,
                name as display_name,
                description as display_description,
                category as display_category,
                sub_category as display_sub_category,
                variants as display_variants
            FROM menu_items
        `;
    }

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).send(err);
        res.send(rows);
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
