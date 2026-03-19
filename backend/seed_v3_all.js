const db = require('./config/db');

const menuItems = [
    // --- 🌍 STARTERS (Existing compatible structure) ---
    { name: "Paneer Pakoda", category: "Starters", sub_category: "Veg Starters", price: 160, diet: "veg", description: "Crispy paneer fritters." },
    { name: "Chicken Pakoda", category: "Starters", sub_category: "Non-Veg Starters", price: 220, diet: "non-veg", description: "Deep-fried chicken strips." },

    // --- 🥘 MAIN MENU (Indian, Chinese, etc.) ---
    { name: "Paneer Butter Masala", category: "Main Menu", sub_category: "Indian", price: 280, diet: "veg", description: "Rich and creamy tomato gravy." },
    { name: "Butter Chicken", category: "Main Menu", sub_category: "North Indian", price: 350, diet: "non-veg", description: "Classic tandoori chicken in butter sauce." },
    { name: "Veg Hakka Noodles", category: "Main Menu", sub_category: "Chinese", price: 220, diet: "veg", description: "Stir-fried noodles with veggies." },

    // --- 🌍 CONTINENTAL ---
    { name: "Garlic Bread with Cheese", category: "Continental", sub_category: "Starters", price: 180, diet: "veg", description: "Classic garlic bread." },
    { name: "Grilled Herb Chicken", category: "Continental", sub_category: "Main Course", price: 450, diet: "non-veg", description: "Herb marinated grilled chicken." },
    { name: "Veg Alfredo Pasta", category: "Continental", sub_category: "Pasta & Rice", price: 320, diet: "veg", description: "Pasta in creamy white sauce." },
    { name: "Chicken Carbonara", category: "Continental", sub_category: "Pasta & Rice", price: 380, diet: "non-veg", description: "Creamy pasta with chicken." },

    // --- 🔥 FUSION ---
    { name: "Paneer Tikka Pizza", category: "Fusion", sub_category: "Indian Fusion", price: 350, diet: "veg", description: "Indian flavored pizza." },
    { name: "Thai Green Curry Pasta", category: "Fusion", sub_category: "Asian Fusion", price: 340, diet: "veg", description: "A unique fusion twist." },
    { name: "Tandoori Chicken Quesadilla", category: "Fusion", sub_category: "Western Fusion", price: 310, diet: "non-veg", description: "Mexican-Indian fusion." },
];

// Add Desserts and Drinks if they are not already there or to update diet tag
const categoriesToSeed = ['Starters', 'Main Menu', 'Continental', 'Fusion', 'Desserts', 'Drinks'];

const seed = async () => {
    // We clear these categories
    db.query("DELETE FROM menu WHERE category IN ('Starters', 'Main Menu', 'Continental', 'Fusion', 'Continental / Fusion')", (err) => {
        if (err) {
            console.error("Error clearing items:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, price, diet, description) VALUES ?";
        const values = menuItems.map(i => [
            i.name, i.category, i.sub_category, i.price, i.diet, i.description
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding items:", err);
            } else {
                console.log(`Master Seed (Starters, Main, Cont, Fusion) Successful: ${result.affectedRows} items added.`);
            }
            // Now update Desserts and Drinks with diet='veg' default if diet is null
            db.query("UPDATE menu SET diet = 'veg' WHERE diet IS NULL", (err2) => {
                if (err2) console.error("Error updating diet tags:", err2);
                process.exit();
            });
        });
    });
};

seed();
