require('dotenv').config();
const db = require('./config/db');

const lang = 'en';
const category = "All";

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

console.log("SQL:", sql);
console.log("PARAMS:", params);

db.query(sql, params, (err, result) => {
    if (err) {
        console.error("❌ ERROR:", err.message);
    } else {
        console.log("✅ SUCCESS, Count:", result.length);
        if (result.length > 0) console.log("Sample Name:", result[0].name);
    }
    process.exit(0);
});
