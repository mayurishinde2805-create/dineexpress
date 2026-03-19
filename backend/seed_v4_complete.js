const db = require('./config/db');

const menuItems = [
    // --- 🥗 STARTERS ---
    { name: "Paneer Pakoda", category: "Starters", sub_category: "Veg Starters", type: "Indian", price: 160, diet: "veg", description: "Crispy paneer fritters." },
    { name: "Hara Bhara Kabab", category: "Starters", sub_category: "Veg Starters", type: "Tandoor", price: 180, diet: "veg", description: "Spinach and pea patties." },
    { name: "Veg Manchurian", category: "Starters", sub_category: "Veg Starters", type: "Chinese", price: 200, diet: "veg", description: "Indo-chinese dumplings." },
    { name: "Chicken Pakoda", category: "Starters", sub_category: "Non-Veg Starters", type: "Indian", price: 220, diet: "non-veg", description: "Deep-fried chicken strips." },
    { name: "Chicken Tikka", category: "Starters", sub_category: "Non-Veg Starters", type: "Tandoor", price: 320, diet: "non-veg", description: "Charcoal grilled chicken." },
    { name: "Crispy Honey Chicken", category: "Starters", sub_category: "Non-Veg Starters", type: "Chinese", price: 300, diet: "non-veg", description: "Sweet and spicy chicken." },

    // --- 🥘 MAIN MENU ---
    { name: "Paneer Butter Masala", category: "Main Menu", sub_category: "Indian", price: 280, diet: "veg", description: "Rich tomato gravy." },
    { name: "Butter Chicken", category: "Main Menu", sub_category: "North Indian", price: 350, diet: "non-veg", description: "Classic chicken in butter sauce." },
    { name: "Chicken Biryani", category: "Main Menu", sub_category: "Indian", price: 320, diet: "non-veg", description: "Fragrant basmati rice with chicken." },
    { name: "Veg Hakka Noodles", category: "Main Menu", sub_category: "Chinese", price: 220, diet: "veg", description: "Wok-tossed noodles." },
    { name: "Chicken Manchurian (Gravy)", category: "Main Menu", sub_category: "Chinese", price: 280, diet: "non-veg", description: "Indo-chinese classic." },
    { name: "Veg Tacos", category: "Main Menu", sub_category: "Mexican", price: 240, diet: "veg", description: "Corn tortillas with beans and salsa." },
    { name: "Chicken Shawarma Plate", category: "Main Menu", sub_category: "Arabic", price: 320, diet: "non-veg", description: "Middle eastern delight." },

    // --- 🌍 CONTINENTAL ---
    { name: "Garlic Bread with Cheese", category: "Continental", sub_category: "Starters", price: 180, diet: "veg", description: "Toasted garlic baguette." },
    { name: "Grilled Herb Chicken", category: "Continental", sub_category: "Main Course", price: 450, diet: "non-veg", description: "Herb marinated grilled chicken." },
    { name: "Veg Alfredo Pasta", category: "Continental", sub_category: "Pasta & Rice", price: 320, diet: "veg", description: "Pasta in creamy white sauce." },
    { name: "Chicken Carbonara", category: "Continental", sub_category: "Pasta & Rice", price: 380, diet: "non-veg", description: "Creamy pasta with smoked chicken." },
    { name: "Mushroom Risotto", category: "Continental", sub_category: "Pasta & Rice", price: 350, diet: "veg", description: "Italian rice with wild mushrooms." },

    // --- 🔥 FUSION ---
    { name: "Paneer Tikka Pizza", category: "Fusion", sub_category: "Indian Fusion", price: 350, diet: "veg", description: "Indian flavored deep-pan pizza." },
    { name: "Thai Green Curry Pasta", category: "Fusion", sub_category: "Asian Fusion", price: 340, diet: "veg", description: "Rice noodles in green curry sauce." },
    { name: "Tandoori Chicken Quesadilla", category: "Fusion", sub_category: "Western Fusion", price: 310, diet: "non-veg", description: "Mexican-Indian fusion snack." },
    { name: "Schezwan Burger", category: "Fusion", sub_category: "Asian Fusion", price: 260, diet: "non-veg", description: "Spicy chinese burger." },

    // --- 🍰 DESSERTS ---
    { name: "Chocolate Lava Cake", category: "Desserts", sub_category: "Cakes", price: 180, diet: "veg", description: "Warm melting chocolate center." },
    { name: "Red Velvet Brownie", category: "Desserts", sub_category: "Brownies", price: 140, diet: "veg", description: "Indulgent red velvet texture." },
    {
        name: "Ice Cream Scoop",
        category: "Desserts",
        sub_category: "Ice Creams",
        price: 80,
        diet: "veg",
        variants: [
            { name: "Single Scoop", price: 80 },
            { name: "Double Scoop", price: 140 }
        ]
    },

    // --- ☕ DRINKS ---
    { name: "Masala Chai", category: "Drinks", sub_category: "Hot Tea", price: 60, diet: "veg", description: "Traditional spicy tea." },
    { name: "Cold Coffee", category: "Drinks", sub_category: "Iced Coffee", price: 120, diet: "veg", description: "Smooth chilled coffee." },
    { name: "Virgin Mojito", category: "Drinks", sub_category: "Mocktails", price: 160, diet: "veg", description: "Refreshing mint and lime." },
];

const seed = async () => {
    db.query("DELETE FROM menu", (err) => {
        if (err) {
            console.error("Error clearing menu:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, type, price, diet, description, variants) VALUES ?";
        const values = menuItems.map(i => [
            i.name, i.category, i.sub_category, i.type || null, i.price, i.diet, i.description,
            i.variants ? JSON.stringify(i.variants) : null
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding menu:", err);
            } else {
                console.log(`Master Menu Seeded Successfully: ${result.affectedRows} items added.`);
            }
            process.exit();
        });
    });
};

seed();
