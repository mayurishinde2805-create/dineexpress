const db = require('./config/db');

exports.seedMenu = (callback) => {
    console.log("Synchronizing Schema & Seeding Menu...");

    // 1. Ensure columns exist (MySQL doesn't support ADD COLUMN IF NOT EXISTS well)
    const ensureColumns = [
        "ALTER TABLE menu ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'food'",
        "ALTER TABLE menu ADD COLUMN IF NOT EXISTS diet VARCHAR(20) DEFAULT 'veg'",
        "ALTER TABLE menu ADD COLUMN IF NOT EXISTS variants JSON",
        "ALTER TABLE menu ADD COLUMN IF NOT EXISTS name_hi VARCHAR(255)",
        "ALTER TABLE menu ADD COLUMN IF NOT EXISTS name_mr VARCHAR(255)",
        "ALTER TABLE menu ADD COLUMN IF NOT EXISTS category_hi VARCHAR(255)",
        "ALTER TABLE menu ADD COLUMN IF NOT EXISTS category_mr VARCHAR(255)",
        "ALTER TABLE menu ADD COLUMN IF NOT EXISTS sub_category_hi VARCHAR(255)",
        "ALTER TABLE menu ADD COLUMN IF NOT EXISTS sub_category_mr VARCHAR(255)"
    ];

    // Wrap in a function to handle potential "column already exists" errors gracefully
    const syncSchema = (idx, cb) => {
        if (idx >= ensureColumns.length) return cb();
        const sql = ensureColumns[idx].replace("IF NOT EXISTS", ""); 
        
        db.query(sql, (err) => {
            // Ignore error 1060 (Duplicate column) or 1061 (Duplicate key)
            syncSchema(idx + 1, cb);
        });
    };


    syncSchema(0, () => {
        const menuData = [

    // ========================================
    // 🥗 STARTERS
    // ========================================
    { name: "Paneer Tikka", category: "Starters", sub_category: "Indian Starters", price: 240, diet: "veg", description: "Soft paneer cubes marinated in spices and grilled in tandoor." },
    { name: "Chicken Tikka", category: "Starters", sub_category: "Tandoor Starters", price: 320, diet: "non-veg", description: "Juicy chicken pieces marinated in yoghurt and spices." },
    { name: "Paneer Pakoda", category: "Starters", sub_category: "Veg Starters", type: "Indian", price: 160, diet: "veg", description: "Crispy paneer fritters with spices", image_url: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=800" },
    { name: "Aloo Tikki", category: "Starters", sub_category: "Veg Starters", type: "Indian", price: 140, diet: "veg", description: "Spiced potato patties", image_url: "https://images.unsplash.com/photo-1626776426318-0005eb3e6be6?auto=format&fit=crop&q=80&w=800" },
    { name: "Onion Bhaji", category: "Starters", sub_category: "Veg Starters", type: "Indian", price: 120, diet: "veg", description: "Deep-fried onion fritters", image_url: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=800" }, 
    { name: "Chicken Pakoda", category: "Starters", sub_category: "Non-Veg Starters", type: "Indian", price: 220, diet: "non-veg", description: "Deep-fried chicken strips", image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800" },
    { name: "Fish Fry", category: "Starters", sub_category: "Non-Veg Starters", type: "Indian", price: 280, diet: "non-veg", description: "Crispy fried fish pieces", image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800" },
    { name: "Veg Spring Rolls", category: "Starters", sub_category: "Veg Starters", type: "Chinese", price: 180, diet: "veg", description: "Crispy vegetable rolls", image_url: "https://images.unsplash.com/photo-1605333396913-c28f9c1b35b6?auto=format&fit=crop&q=80&w=800" },
    { name: "Veg Manchurian", category: "Starters", sub_category: "Veg Starters", type: "Chinese", price: 200, diet: "veg", description: "Indo-chinese vegetable dumplings", image_url: "https://images.unsplash.com/photo-1625938144755-652e08e359b7?auto=format&fit=crop&q=80&w=800" },
    { name: "Chilli Chicken", category: "Starters", sub_category: "Non-Veg Starters", type: "Chinese", price: 260, diet: "non-veg", description: "Spicy chicken in chilli sauce", image_url: "https://images.unsplash.com/photo-1599629954204-0322c3329b35?auto=format&fit=crop&q=80&w=800" },
    { name: "Dragon Chicken", category: "Starters", sub_category: "Non-Veg Starters", type: "Chinese", price: 280, diet: "non-veg", description: "Fiery chicken with peppers", image_url: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=800" },
    { name: "Hara Bhara Kabab", category: "Starters", sub_category: "Veg Starters", type: "Tandoor", price: 180, diet: "veg", description: "Spinach and pea patties", image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800" },
    { name: "Malai Paneer Tikka", category: "Starters", sub_category: "Veg Starters", type: "Tandoor", price: 260, diet: "veg", description: "Creamy paneer tikka", image_url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800" },
    { name: "Chicken Tandoori", category: "Starters", sub_category: "Non-Veg Starters", type: "Tandoor", price: 320, diet: "non-veg", description: "Charcoal grilled chicken", image_url: "https://images.unsplash.com/photo-1599487488170-d11ec9c53034?auto=format&fit=crop&q=80&w=800" },
    { name: "Tandoori Fish", category: "Starters", sub_category: "Non-Veg Starters", type: "Tandoor", price: 380, diet: "non-veg", description: "Tandoor grilled fish", image_url: "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&q=80&w=800" },
    { name: "Garlic Bread", category: "Starters", sub_category: "Veg Starters", type: "Continental", price: 120, diet: "veg", description: "Toasted garlic baguette", image_url: "https://images.unsplash.com/photo-1573140247632-f84660f67627?auto=format&fit=crop&q=80&w=800" },
    { name: "French Fries", category: "Starters", sub_category: "Veg Starters", type: "Continental", price: 100, diet: "veg", description: "Crispy potato fries", image_url: "https://images.unsplash.com/photo-1630384060421-a4323ce5663e?auto=format&fit=crop&q=80&w=800" },
    { name: "Chicken Wings", category: "Starters", sub_category: "Non-Veg Starters", type: "Continental", price: 280, diet: "non-veg", description: "Spicy chicken wings", image_url: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=800" },
    { name: "Fish Fingers", category: "Starters", sub_category: "Non-Veg Starters", type: "Continental", price: 260, diet: "non-veg", description: "Breaded fish strips", image_url: "https://images.unsplash.com/photo-1597403491447-3ab08f8e4486?auto=format&fit=crop&q=80&w=800" },

    // 🍽️ MAIN MENU
    { name: "Paneer Butter Masala", category: "Main Menu", sub_category: "Indian", price: 280, diet: "veg", description: "Rich tomato gravy with paneer", image_url: "https://images.unsplash.com/photo-1631452180519-c0743697a78e?auto=format&fit=crop&q=80&w=800" },
    { name: "Dal Makhani", category: "Main Menu", sub_category: "Indian", price: 220, diet: "veg", description: "Creamy black lentils", image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800" },
    { name: "Mutton Rogan Josh", category: "Main Menu", sub_category: "Indian", price: 420, diet: "non-veg", description: "Kashmiri mutton curry", image_url: "https://images.unsplash.com/photo-1555196301-9acc011dfde4?auto=format&fit=crop&q=80&w=800" },
    { name: "Butter Chicken", category: "Main Menu", sub_category: "North Indian", price: 350, diet: "non-veg", description: "Classic chicken in butter sauce", image_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800" },
    { name: "Palak Paneer", category: "Main Menu", sub_category: "North Indian", price: 260, diet: "veg", description: "Spinach with cottage cheese", image_url: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&q=80&w=800" },
    { name: "Chole Bhature", category: "Main Menu", sub_category: "North Indian", price: 180, diet: "veg", description: "Chickpea curry with fried bread", image_url: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800" },
    { name: "Veg Hakka Noodles", category: "Main Menu", sub_category: "Chinese", price: 220, diet: "veg", description: "Wok-tossed noodles", image_url: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=800" },
    { name: "Chicken Manchurian (Gravy)", category: "Main Menu", sub_category: "Chinese", price: 280, diet: "non-veg", description: "Indo-chinese classic", image_url: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=800" },
    { name: "Schezwan Fried Rice", category: "Main Menu", sub_category: "Chinese", price: 240, diet: "veg", description: "Spicy fried rice", image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb74b?auto=format&fit=crop&q=80&w=800" },
    { name: "Veg Tacos", category: "Main Menu", sub_category: "Mexican", price: 240, diet: "veg", description: "Corn tortillas with beans and salsa", image_url: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=800" },
    { name: "Chicken Burrito", category: "Main Menu", sub_category: "Mexican", price: 320, diet: "non-veg", description: "Wrapped tortilla with chicken", image_url: "https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?auto=format&fit=crop&q=80&w=800" },
    { name: "Chicken Shawarma Plate", category: "Main Menu", sub_category: "Arabic", price: 320, diet: "non-veg", description: "Middle eastern delight", image_url: "https://images.unsplash.com/photo-1561651823-34febf224567?auto=format&fit=crop&q=80&w=800" },
    { name: "Falafel Wrap", category: "Main Menu", sub_category: "Arabic", price: 220, diet: "veg", description: "Chickpea fritters in pita", image_url: "https://images.unsplash.com/photo-1561651862-2d17c7689947?auto=format&fit=crop&q=80&w=800" },

    // 🌍 CONTINENTAL
    { name: "Garlic Bread with Cheese", category: "Continental", sub_category: "Starters", price: 180, diet: "veg", description: "Toasted garlic baguette with cheese", image_url: "https://images.unsplash.com/photo-1573140247632-f84660f67627?auto=format&fit=crop&q=80&w=800" },
    { name: "Bruschetta", category: "Continental", sub_category: "Starters", price: 200, diet: "veg", description: "Tomato basil on toasted bread", image_url: "https://images.unsplash.com/photo-1572695157369-24d29ca1aa74?auto=format&fit=crop&q=80&w=800" },
    { name: "Grilled Herb Chicken", category: "Continental", sub_category: "Main Course", price: 450, diet: "non-veg", description: "Herb marinated grilled chicken", image_url: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=800" },
    { name: "Fish and Chips", category: "Continental", sub_category: "Main Course", price: 420, diet: "non-veg", description: "Battered fish with fries", image_url: "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&q=80&w=800" },
    { name: "Veg Alfredo Pasta", category: "Continental", sub_category: "Pasta & Rice", price: 320, diet: "veg", description: "Pasta in creamy white sauce", image_url: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=800" },
    { name: "Chicken Carbonara", category: "Continental", sub_category: "Pasta & Rice", price: 380, diet: "non-veg", description: "Creamy pasta with smoked chicken", image_url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800" },
    { name: "Mushroom Risotto", category: "Continental", sub_category: "Pasta & Rice", price: 350, diet: "veg", description: "Italian rice with wild mushrooms", image_url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=800" },

    // 🔥 FUSION
    { name: "Paneer Tikka Pizza", category: "Fusion", sub_category: "Indian Fusion", price: 350, diet: "veg", description: "Indian flavored deep-pan pizza", image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800" },
    { name: "Butter Chicken Pizza", category: "Fusion", sub_category: "Indian Fusion", price: 420, diet: "non-veg", description: "Pizza with butter chicken topping", image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800" },
    { name: "Thai Green Curry Pasta", category: "Fusion", sub_category: "Asian Fusion", price: 340, diet: "veg", description: "Rice noodles in green curry sauce", image_url: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80&w=800" },
    { name: "Schezwan Burger", category: "Fusion", sub_category: "Asian Fusion", price: 260, diet: "non-veg", description: "Spicy chinese burger", image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800" },
    { name: "Tandoori Chicken Quesadilla", category: "Fusion", sub_category: "Western Fusion", price: 310, diet: "non-veg", description: "Mexican-Indian fusion snack", image_url: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&q=80&w=800" },

    // 🍰 DESSERTS
    { name: "Chocolate Lava Cake", category: "Desserts", sub_category: "Cakes", price: 180, diet: "veg", description: "Warm melting chocolate center", image_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800" },
    { name: "Red Velvet Cake", category: "Desserts", sub_category: "Cakes", price: 200, diet: "veg", description: "Classic red velvet with cream cheese", image_url: "https://images.unsplash.com/photo-1586788680434-30d32443d4fa?auto=format&fit=crop&q=80&w=800" },
    { name: "Black Forest Cake", category: "Desserts", sub_category: "Cakes", price: 220, diet: "veg", description: "Chocolate cake with cherries", image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800" },
    { name: "Red Velvet Brownie", category: "Desserts", sub_category: "Brownies", price: 140, diet: "veg", description: "Indulgent red velvet texture", image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476d?auto=format&fit=crop&q=80&w=800" },
    { name: "Chocolate Fudge Brownie", category: "Desserts", sub_category: "Brownies", price: 160, diet: "veg", description: "Rich chocolate brownie", image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476d?auto=format&fit=crop&q=80&w=800" },
    { name: "Sundae Special", category: "Desserts", sub_category: "Ice Creams", price: 180, diet: "veg", description: "Ice cream with toppings", image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800" },
    { name: "Hot Chocolate Fudge Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 220, diet: "veg", description: "Ice cream with hot fudge", image_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800" },
    { name: "Brownie Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 240, diet: "veg", description: "Brownie with ice cream", image_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=800" },
    { name: "Chocolate Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 140, diet: "veg", description: "Thick chocolate shake", image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800" },
    { name: "Strawberry Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 140, diet: "veg", description: "Fresh strawberry shake", image_url: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=800" },
    { name: "Oreo Shake", category: "Desserts", sub_category: "Milkshakes", price: 160, diet: "veg", description: "Cookies and cream shake", image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800" },
    { name: "Chocolate Chip Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 100, diet: "veg", description: "Freshly baked cookies", image_url: "https://images.unsplash.com/photo-1499636138143-bd649043ea80?auto=format&fit=crop&q=80&w=800" },
    { name: "Chocolate Truffle", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 120, diet: "veg", description: "Rich chocolate truffle", image_url: "https://images.unsplash.com/photo-1606312619070-d48b706521af?auto=format&fit=crop&q=80&w=800" },
    { name: "Tiramisu", category: "Desserts", sub_category: "Chef's Special", price: 280, diet: "veg", description: "Italian coffee dessert", image_url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800" },
    { name: "Gulab Jamun with Ice Cream", category: "Desserts", sub_category: "Chef's Special", price: 180, diet: "veg", description: "Traditional Indian sweet with ice cream", image_url: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=800" },

    // ☕ DRINKS
    { name: "Masala Chai", category: "Drinks", sub_category: "Hot Tea", price: 60, diet: "veg", description: "Traditional spicy tea", image_url: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800" },
    { name: "Green Tea", category: "Drinks", sub_category: "Hot Tea", price: 80, diet: "veg", description: "Healthy green tea", image_url: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=800" },
    { name: "Lemon Tea", category: "Drinks", sub_category: "Hot Tea", price: 70, diet: "veg", description: "Refreshing lemon tea", image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800" },
    { name: "Cold Coffee", category: "Drinks", sub_category: "Iced Coffee", price: 120, diet: "veg", description: "Smooth chilled coffee", image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800" },
    { name: "Iced Latte", category: "Drinks", sub_category: "Iced Coffee", price: 140, diet: "veg", description: "Espresso with cold milk", image_url: "https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?auto=format&fit=crop&q=80&w=800" },
    { name: "Caramel Frappe", category: "Drinks", sub_category: "Iced Coffee", price: 160, diet: "veg", description: "Blended caramel coffee", image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800" },
    { name: "Virgin Mojito", category: "Drinks", sub_category: "Mocktails", price: 160, diet: "veg", description: "Refreshing mint and lime", image_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800" },
    { name: "Blue Lagoon", category: "Drinks", sub_category: "Mocktails", price: 180, diet: "veg", description: "Blue curacao mocktail", image_url: "https://images.unsplash.com/photo-1627258994796-02a46587c699?auto=format&fit=crop&q=80&w=800" },
    { name: "Watermelon Cooler", category: "Drinks", sub_category: "Mocktails", price: 150, diet: "veg", description: "Fresh watermelon drink", image_url: "https://images.unsplash.com/photo-1587049352847-81a56d773cae?auto=format&fit=crop&q=80&w=800" },
    ];

    db.query("DELETE FROM menu", (err) => {
        if (err) {
            console.error(err);
            if (callback) callback(err);
            return;
        }

        const values = menuData.map(i => [
            i.name, i.category, i.sub_category, i.type || 'food',
            i.price, i.diet || 'veg', i.description || '',
            JSON.stringify(i.variants || []),
            i.image_url || null
        ]);

        const sql = "INSERT INTO menu (name, category, sub_category, type, price, diet, description, variants, image_url) VALUES ?";
        
        const chunkSize = 10;
        const count = values.length;
        let completed = 0;
        let hasError = false;

        for (let i = 0; i < count; i += chunkSize) {
            const chunk = values.slice(i, i + chunkSize);
            db.query(sql, [chunk], (err2) => {
                if (hasError) return;
                if (err2) {
                    hasError = true;
                    console.error("Chunk Error:", err2);
                    if (callback) callback(err2);
                    return;
                }
                completed += chunk.length;
                if (completed >= count) {
                    console.log("✅ Main Menu Seed Complete (Chunked).");
                    if (callback) callback(null);
                }
            });
        }
    });
    }); // <--- Closed syncSchema callback here
};

if (require.main === module) {
    exports.seedMenu((err) => {
        if (err) { console.error("Seeding failed:", err); process.exit(1); }
        else { console.log("Seeding process finished successfully."); process.exit(0); }
    });
}
