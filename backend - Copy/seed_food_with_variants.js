const db = require('./config/db');

const menuItems = [
    // ========================================
    // 🥗 STARTERS (No variants - single serving)
    // ========================================

    // Indian Starters (Veg)
    { name: "Paneer Pakoda", category: "Starters", sub_category: "Veg Starters", type: "Indian", price: 160, diet: "veg", description: "Crispy paneer fritters with spices" },
    { name: "Aloo Tikki", category: "Starters", sub_category: "Veg Starters", type: "Indian", price: 140, diet: "veg", description: "Spiced potato patties" },
    { name: "Onion Bhaji", category: "Starters", sub_category: "Veg Starters", type: "Indian", price: 120, diet: "veg", description: "Deep-fried onion fritters" },

    // Indian Starters (Non-Veg)
    { name: "Chicken Pakoda", category: "Starters", sub_category: "Non-Veg Starters", type: "Indian", price: 220, diet: "non-veg", description: "Deep-fried chicken strips" },
    { name: "Fish Fry", category: "Starters", sub_category: "Non-Veg Starters", type: "Indian", price: 280, diet: "non-veg", description: "Crispy fried fish pieces" },

    // Chinese Starters (Veg)
    { name: "Veg Spring Rolls", category: "Starters", sub_category: "Veg Starters", type: "Chinese", price: 180, diet: "veg", description: "Crispy vegetable rolls" },
    { name: "Veg Manchurian", category: "Starters", sub_category: "Veg Starters", type: "Chinese", price: 200, diet: "veg", description: "Indo-chinese vegetable dumplings" },

    // Chinese Starters (Non-Veg)
    { name: "Chilli Chicken", category: "Starters", sub_category: "Non-Veg Starters", type: "Chinese", price: 260, diet: "non-veg", description: "Spicy chicken in chilli sauce" },
    { name: "Dragon Chicken", category: "Starters", sub_category: "Non-Veg Starters", type: "Chinese", price: 280, diet: "non-veg", description: "Fiery chicken with peppers" },

    // Tandoor Starters (Veg)
    { name: "Paneer Tikka", category: "Starters", sub_category: "Veg Starters", type: "Tandoor", price: 240, diet: "veg", description: "Grilled paneer cubes" },
    { name: "Hara Bhara Kabab", category: "Starters", sub_category: "Veg Starters", type: "Tandoor", price: 180, diet: "veg", description: "Spinach and pea patties" },
    { name: "Malai Paneer Tikka", category: "Starters", sub_category: "Veg Starters", type: "Tandoor", price: 260, diet: "veg", description: "Creamy paneer tikka" },

    // Tandoor Starters (Non-Veg)
    {
        name: "Chicken Tandoori", category: "Starters", sub_category: "Non-Veg Starters", type: "Tandoor", price: 320, diet: "non-veg", description: "Charcoal grilled chicken",
        variants: [{ name: "Half", price: 320 }, { name: "Full", price: 580 }]
    },
    { name: "Chicken Tikka", category: "Starters", sub_category: "Non-Veg Starters", type: "Tandoor", price: 320, diet: "non-veg", description: "Grilled chicken chunks" },
    { name: "Tandoori Fish", category: "Starters", sub_category: "Non-Veg Starters", type: "Tandoor", price: 380, diet: "non-veg", description: "Tandoor grilled fish" },

    // Continental Starters (Veg)
    { name: "Garlic Bread", category: "Starters", sub_category: "Veg Starters", type: "Continental", price: 120, diet: "veg", description: "Toasted garlic baguette" },
    { name: "French Fries", category: "Starters", sub_category: "Veg Starters", type: "Continental", price: 100, diet: "veg", description: "Crispy potato fries" },

    // Continental Starters (Non-Veg)
    { name: "Chicken Wings", category: "Starters", sub_category: "Non-Veg Starters", type: "Continental", price: 280, diet: "non-veg", description: "Spicy chicken wings" },
    { name: "Fish Fingers", category: "Starters", sub_category: "Non-Veg Starters", type: "Continental", price: 260, diet: "non-veg", description: "Breaded fish strips" },

    // ========================================
    // 🍽️ MAIN MENU (Half/Full variants for curries)
    // ========================================

    // Indian
    {
        name: "Paneer Butter Masala", category: "Main Menu", sub_category: "Indian", price: 280, diet: "veg", description: "Rich tomato gravy with paneer",
        variants: [{ name: "Half", price: 280 }, { name: "Full", price: 480 }]
    },
    {
        name: "Dal Makhani", category: "Main Menu", sub_category: "Indian", price: 220, diet: "veg", description: "Creamy black lentils",
        variants: [{ name: "Half", price: 220 }, { name: "Full", price: 380 }]
    },
    {
        name: "Chicken Biryani", category: "Main Menu", sub_category: "Indian", price: 320, diet: "non-veg", description: "Fragrant basmati rice with chicken",
        variants: [{ name: "Half", price: 320 }, { name: "Full", price: 550 }]
    },
    {
        name: "Mutton Rogan Josh", category: "Main Menu", sub_category: "Indian", price: 420, diet: "non-veg", description: "Kashmiri mutton curry",
        variants: [{ name: "Half", price: 420 }, { name: "Full", price: 720 }]
    },

    // North Indian
    {
        name: "Butter Chicken", category: "Main Menu", sub_category: "North Indian", price: 350, diet: "non-veg", description: "Classic chicken in butter sauce",
        variants: [{ name: "Half", price: 350 }, { name: "Full", price: 600 }]
    },
    {
        name: "Palak Paneer", category: "Main Menu", sub_category: "North Indian", price: 260, diet: "veg", description: "Spinach with cottage cheese",
        variants: [{ name: "Half", price: 260 }, { name: "Full", price: 450 }]
    },
    { name: "Chole Bhature", category: "Main Menu", sub_category: "North Indian", price: 180, diet: "veg", description: "Chickpea curry with fried bread" },

    // Chinese
    { name: "Veg Hakka Noodles", category: "Main Menu", sub_category: "Chinese", price: 220, diet: "veg", description: "Wok-tossed noodles" },
    {
        name: "Chicken Manchurian (Gravy)", category: "Main Menu", sub_category: "Chinese", price: 280, diet: "non-veg", description: "Indo-chinese classic",
        variants: [{ name: "Half", price: 280 }, { name: "Full", price: 480 }]
    },
    { name: "Schezwan Fried Rice", category: "Main Menu", sub_category: "Chinese", price: 240, diet: "veg", description: "Spicy fried rice" },

    // Mexican
    { name: "Veg Tacos", category: "Main Menu", sub_category: "Mexican", price: 240, diet: "veg", description: "Corn tortillas with beans and salsa" },
    { name: "Chicken Burrito", category: "Main Menu", sub_category: "Mexican", price: 320, diet: "non-veg", description: "Wrapped tortilla with chicken" },

    // Arabic
    { name: "Chicken Shawarma Plate", category: "Main Menu", sub_category: "Arabic", price: 320, diet: "non-veg", description: "Middle eastern delight" },
    { name: "Falafel Wrap", category: "Main Menu", sub_category: "Arabic", price: 220, diet: "veg", description: "Chickpea fritters in pita" },

    // ========================================
    // 🌍 CONTINENTAL
    // ========================================

    // Starters
    { name: "Garlic Bread with Cheese", category: "Continental", sub_category: "Starters", price: 180, diet: "veg", description: "Toasted garlic baguette with cheese" },
    { name: "Bruschetta", category: "Continental", sub_category: "Starters", price: 200, diet: "veg", description: "Tomato basil on toasted bread" },

    // Main Course
    { name: "Grilled Herb Chicken", category: "Continental", sub_category: "Main Course", price: 450, diet: "non-veg", description: "Herb marinated grilled chicken" },
    { name: "Fish and Chips", category: "Continental", sub_category: "Main Course", price: 420, diet: "non-veg", description: "Battered fish with fries" },

    // Pasta & Rice
    { name: "Veg Alfredo Pasta", category: "Continental", sub_category: "Pasta & Rice", price: 320, diet: "veg", description: "Pasta in creamy white sauce" },
    { name: "Chicken Carbonara", category: "Continental", sub_category: "Pasta & Rice", price: 380, diet: "non-veg", description: "Creamy pasta with smoked chicken" },
    { name: "Mushroom Risotto", category: "Continental", sub_category: "Pasta & Rice", price: 350, diet: "veg", description: "Italian rice with wild mushrooms" },

    // ========================================
    // 🔥 FUSION
    // ========================================

    // Indian Fusion
    {
        name: "Paneer Tikka Pizza", category: "Fusion", sub_category: "Indian Fusion", price: 350, diet: "veg", description: "Indian flavored deep-pan pizza",
        variants: [{ name: "Small", price: 350 }, { name: "Medium", price: 550 }, { name: "Large", price: 750 }]
    },
    {
        name: "Butter Chicken Pizza", category: "Fusion", sub_category: "Indian Fusion", price: 420, diet: "non-veg", description: "Pizza with butter chicken topping",
        variants: [{ name: "Small", price: 420 }, { name: "Medium", price: 620 }, { name: "Large", price: 820 }]
    },

    // Asian Fusion
    { name: "Thai Green Curry Pasta", category: "Fusion", sub_category: "Asian Fusion", price: 340, diet: "veg", description: "Rice noodles in green curry sauce" },
    { name: "Schezwan Burger", category: "Fusion", sub_category: "Asian Fusion", price: 260, diet: "non-veg", description: "Spicy chinese burger" },

    // Western Fusion
    { name: "Tandoori Chicken Quesadilla", category: "Fusion", sub_category: "Western Fusion", price: 310, diet: "non-veg", description: "Mexican-Indian fusion snack" },

    // ========================================
    // 🍰 DESSERTS (Scoop variants for ice cream)
    // ========================================

    // Cakes
    { name: "Chocolate Lava Cake", category: "Desserts", sub_category: "Cakes", price: 180, diet: "veg", description: "Warm melting chocolate center" },
    {
        name: "Red Velvet Cake", category: "Desserts", sub_category: "Cakes", price: 200, diet: "veg", description: "Classic red velvet with cream cheese",
        variants: [{ name: "Slice", price: 200 }, { name: "Half Kg", price: 800 }, { name: "1 Kg", price: 1500 }]
    },
    {
        name: "Black Forest Cake", category: "Desserts", sub_category: "Cakes", price: 220, diet: "veg", description: "Chocolate cake with cherries",
        variants: [{ name: "Slice", price: 220 }, { name: "Half Kg", price: 850 }, { name: "1 Kg", price: 1600 }]
    },

    // Brownies
    { name: "Red Velvet Brownie", category: "Desserts", sub_category: "Brownies", price: 140, diet: "veg", description: "Indulgent red velvet texture" },
    { name: "Chocolate Fudge Brownie", category: "Desserts", sub_category: "Brownies", price: 160, diet: "veg", description: "Rich chocolate brownie" },

    // Ice Creams
    {
        name: "Ice Cream Scoop", category: "Desserts", sub_category: "Ice Creams", price: 80, diet: "veg", description: "Choose your favorite flavor",
        variants: [{ name: "Single Scoop", price: 80 }, { name: "Double Scoop", price: 140 }, { name: "Triple Scoop", price: 200 }]
    },
    { name: "Sundae Special", category: "Desserts", sub_category: "Ice Creams", price: 180, diet: "veg", description: "Ice cream with toppings" },

    // Sundaes & Combos
    { name: "Hot Chocolate Fudge Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 220, diet: "veg", description: "Ice cream with hot fudge" },
    { name: "Brownie Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 240, diet: "veg", description: "Brownie with ice cream" },

    // Milkshakes
    {
        name: "Chocolate Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 140, diet: "veg", description: "Thick chocolate shake",
        variants: [{ name: "Regular", price: 140 }, { name: "Large", price: 200 }]
    },
    {
        name: "Strawberry Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 140, diet: "veg", description: "Fresh strawberry shake",
        variants: [{ name: "Regular", price: 140 }, { name: "Large", price: 200 }]
    },
    {
        name: "Oreo Shake", category: "Desserts", sub_category: "Milkshakes", price: 160, diet: "veg", description: "Cookies and cream shake",
        variants: [{ name: "Regular", price: 160 }, { name: "Large", price: 220 }]
    },

    // Cookies & Biscuits
    { name: "Chocolate Chip Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 100, diet: "veg", description: "Freshly baked cookies" },

    // Chocolates & Dessert Bites
    { name: "Chocolate Truffle", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 120, diet: "veg", description: "Rich chocolate truffle" },

    // Chef's Special
    { name: "Tiramisu", category: "Desserts", sub_category: "Chef's Special", price: 280, diet: "veg", description: "Italian coffee dessert" },
    { name: "Gulab Jamun with Ice Cream", category: "Desserts", sub_category: "Chef's Special", price: 180, diet: "veg", description: "Traditional Indian sweet with ice cream" },
];

const seed = async () => {
    // Delete only non-drinks items
    db.query("DELETE FROM menu WHERE category != 'Drinks'", (err) => {
        if (err) {
            console.error("Error clearing menu:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, type, price, diet, description, variants) VALUES ?";
        const values = menuItems.map(i => [
            i.name,
            i.category,
            i.sub_category,
            i.type || null,
            i.price,
            i.diet,
            i.description,
            i.variants ? JSON.stringify(i.variants) : null
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding menu:", err);
            } else {
                console.log(`✅ Food Menu Updated Successfully: ${result.affectedRows} items added.`);
            }
            process.exit();
        });
    });
};

seed();
