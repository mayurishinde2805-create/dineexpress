const db = require('./config/db');

const menuItems = [
    // --- 🌍 CONTINENTAL ---
    // Starters
    { name: "Garlic Bread with Cheese", category: "Continental", sub_category: "Starters", price: 180, diet: "veg", description: "Toasted baguette with garlic butter and melted mozzarella." },
    { name: "Bruschetta Pomodoro", category: "Continental", sub_category: "Starters", price: 210, diet: "veg", description: "Grilled bread topped with tomatoes, garlic, and basil." },
    { name: "Chicken Wings (BBQ)", category: "Continental", sub_category: "Starters", price: 280, diet: "non-veg", description: "Crispy wings tossed in smokey BBQ sauce." },
    { name: "Prawn Cocktail", category: "Continental", sub_category: "Starters", price: 350, diet: "non-veg", description: "Classic chilled prawns with Marie Rose sauce." },

    // Main Course
    { name: "Grilled Herb Chicken", category: "Continental", sub_category: "Main Course", price: 450, diet: "non-veg", description: "Succulent chicken breast with rosemary and thyme." },
    { name: "Pan-Seared Salmon", category: "Continental", sub_category: "Main Course", price: 650, diet: "non-veg", description: "Fresh salmon filet with lemon butter sauce." },
    { name: "Garden Vegetable Steak", category: "Continental", sub_category: "Main Course", price: 380, diet: "veg", description: "Grilled veggie patty with mash and gravy." },

    // Pasta & Rice
    { name: "Veg Alfredo Pasta", category: "Continental", sub_category: "Pasta & Rice", price: 320, diet: "veg", description: "Creamy white sauce pasta with exotic veggies." },
    { name: "Penne Arrabbiata", category: "Continental", sub_category: "Pasta & Rice", price: 300, diet: "veg", description: "Spicy tomato sauce with garlic and chili flakes." },
    { name: "Chicken Carbonara", category: "Continental", sub_category: "Pasta & Rice", price: 380, diet: "non-veg", description: "Rich creamy pasta with smoked chicken and egg." },
    { name: "Mushroom Risotto", category: "Continental", sub_category: "Pasta & Rice", price: 350, diet: "veg", description: "Arborio rice cooked with wild mushrooms and parmesan." },

    // --- 🔥 FUSION ---
    // Indian Fusion
    { name: "Paneer Tikka Pizza", category: "Fusion", sub_category: "Indian Fusion", price: 350, diet: "veg", description: "Thin crust pizza topped with spicy paneer tikka." },
    { name: "Butter Chicken Pasta", category: "Fusion", sub_category: "Indian Fusion", price: 380, diet: "non-veg", description: "Creamy butter chicken sauce with penne." },
    { name: "Vada Pav Sliders", category: "Fusion", sub_category: "Indian Fusion", price: 220, diet: "veg", description: "Miniature vada pavs with spicy chutney." },

    // Asian Fusion
    { name: "Thai Green Curry Pasta", category: "Fusion", sub_category: "Asian Fusion", price: 340, diet: "veg", description: "Fusion of Italian pasta and Thai flavors." },
    { name: "Schezwan Chicken Bao", category: "Fusion", sub_category: "Asian Fusion", price: 290, diet: "non-veg", description: "Soft steamed buns filled with spicy schezwan chicken." },
    { name: "Kimchi Fried Rice", category: "Fusion", sub_category: "Asian Fusion", price: 280, diet: "veg", description: "Korean-inspired fried rice with spicy kimchi." },

    // Western Fusion
    { name: "Spicy Peri-Peri Paneer Burger", category: "Fusion", sub_category: "Western Fusion", price: 260, diet: "veg", description: "Peri-peri marinated paneer in a toasted bun." },
    { name: "Tandoori Chicken Quesadilla", category: "Fusion", sub_category: "Western Fusion", price: 310, diet: "non-veg", description: "Mexican tortillas filled with tandoori chicken." },
    { name: "Mexican Bhel", category: "Fusion", sub_category: "Western Fusion", price: 190, diet: "veg", description: "Classic Indian bhel with a salsa and corn twist." },
];

const seed = async () => {
    // We clear Continental and Fusion to avoid duplicates
    db.query("DELETE FROM menu WHERE category IN ('Continental', 'Fusion', 'Continental / Fusion')", (err) => {
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
                console.log(`Continental & Fusion Seeded Successfully: ${result.affectedRows} items added.`);
            }
            process.exit();
        });
    });
};

seed();
