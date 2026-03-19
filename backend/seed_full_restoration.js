const db = require('./config/db');

// 1. STARTERS (From seed_starters_overhaul.js)
const starterItems = [
    // Veg Starters
    { name: "Veg Spring Rolls", category: "Starters", sub_category: "Veg Starters", price: 180, description: "Crispy vegetable rolls", diet: "veg" },
    { name: "Paneer Tikka", category: "Starters", sub_category: "Veg Starters", price: 240, description: "Grilled paneer cubes", diet: "veg" },
    { name: "Veg Manchurian", category: "Starters", sub_category: "Veg Starters", price: 190, description: "Indo-chinese dumplings", diet: "veg" },
    { name: "Crispy Corn", category: "Starters", sub_category: "Veg Starters", price: 170, description: "Fried corn kernels", diet: "veg" },
    { name: "Hara Bhara Kebab", category: "Starters", sub_category: "Veg Starters", price: 210, description: "Spinach and pea patties", diet: "veg" },
    { name: "Cheese Balls", category: "Starters", sub_category: "Veg Starters", price: 200, description: "Fried cheese balls", diet: "veg" },

    // Non-Veg Starters
    { name: "Chicken Tikka", category: "Starters", sub_category: "Non-Veg Starters", price: 280, description: "Tandoor grilled chicken", diet: "non-veg" },
    { name: "Chicken 65", category: "Starters", sub_category: "Non-Veg Starters", price: 260, description: "Spicy fried chicken", diet: "non-veg" },
    { name: "Chicken Lollipop", category: "Starters", sub_category: "Non-Veg Starters", price: 270, description: "Fried chicken winglets", diet: "non-veg" },
    { name: "Fish Fingers", category: "Starters", sub_category: "Non-Veg Starters", price: 320, description: "Breaded fish strips", diet: "non-veg" },
    { name: "Prawns Fry", category: "Starters", sub_category: "Non-Veg Starters", price: 380, description: "Spicy fried prawns", diet: "non-veg" },

    // Indian Starters
    { name: "Paneer Pakoda", category: "Starters", sub_category: "Indian Starters", price: 160, description: "Paneer fritters", diet: "veg" },
    { name: "Aloo Tikki", category: "Starters", sub_category: "Indian Starters", price: 120, description: "Potato patties", diet: "veg" },
    { name: "Onion Bhaji", category: "Starters", sub_category: "Indian Starters", price: 110, description: "Onion fritters", diet: "veg" },
    { name: "Samosa", category: "Starters", sub_category: "Indian Starters", price: 90, description: "Fried pastry with filling", diet: "veg" },
    { name: "Dahi Kebab", category: "Starters", sub_category: "Indian Starters", price: 220, description: "Yogurt patties", diet: "veg" },

    // Chinese Starters
    { name: "Chilli Paneer", category: "Starters", sub_category: "Chinese Starters", price: 230, description: "Spicy cottage cheese", diet: "veg" },
    { name: "Chilli Chicken", category: "Starters", sub_category: "Chinese Starters", price: 290, description: "Spicy chicken stir fry", diet: "non-veg" },
    { name: "Crispy Baby Corn", category: "Starters", sub_category: "Chinese Starters", price: 180, description: "Fried baby corn", diet: "veg" },
    { name: "Chicken Spring Roll", category: "Starters", sub_category: "Chinese Starters", price: 210, description: "Chicken stuffed rolls", diet: "non-veg" },

    // Tandoor Starters
    { name: "Malai Paneer Tikka", category: "Starters", sub_category: "Tandoor Starters", price: 260, description: "Creamy paneer tikka", diet: "veg" },
    { name: "Chicken Tandoori", category: "Starters", sub_category: "Tandoor Starters", price: 340, description: "Whole roast chicken", diet: "non-veg" },
    { name: "Chicken Malai Tikka", category: "Starters", sub_category: "Tandoor Starters", price: 320, description: "Creamy chicken tikka", diet: "non-veg" },
    { name: "Seekh Kebab", category: "Starters", sub_category: "Tandoor Starters", price: 350, description: "Minced meat kebab", diet: "non-veg" },

    // Continental Starters
    { name: "Garlic Bread", category: "Starters", sub_category: "Continental Starters", price: 150, description: "Toasted garlic bread", diet: "veg" },
    { name: "Cheese Garlic Bread", category: "Starters", sub_category: "Continental Starters", price: 180, description: "Garlic bread with cheese", diet: "veg" },
    { name: "French Fries", category: "Starters", sub_category: "Continental Starters", price: 120, description: "Classic salted fries", diet: "veg" },
    { name: "Potato Wedges", category: "Starters", sub_category: "Continental Starters", price: 140, description: "Spiced potato wedges", diet: "veg" },
    { name: "Nachos with Cheese", category: "Starters", sub_category: "Continental Starters", price: 200, description: "Nachos with cheese dip", diet: "veg" },

    // Chef's Special Starters
    { name: "Mixed Starter Platter", category: "Starters", sub_category: "Chef's Special Starters", price: 550, description: "Assorted vegetarian starters", diet: "veg" },
    { name: "Non-Veg Starter Combo", category: "Starters", sub_category: "Chef's Special Starters", price: 650, description: "Assorted chicken and fish starters", diet: "non-veg" }
];

// 2. MAIN MENU (From seed_complete_menu.js - Main Menu, Continental Main, Fusion)
const mainItems = [
    // Indian
    { name: "Paneer Butter Masala", category: "Main Menu", sub_category: "Indian", price: 280, diet: "veg", description: "Rich tomato gravy with paneer" },
    { name: "Dal Makhani", category: "Main Menu", sub_category: "Indian", price: 220, diet: "veg", description: "Creamy black lentils" },
    { name: "Chicken Biryani", category: "Main Menu", sub_category: "Indian", price: 320, diet: "non-veg", description: "Fragrant basmati rice with chicken" },
    { name: "Mutton Rogan Josh", category: "Main Menu", sub_category: "Indian", price: 420, diet: "non-veg", description: "Kashmiri mutton curry" },

    // North Indian
    { name: "Butter Chicken", category: "Main Menu", sub_category: "North Indian", price: 350, diet: "non-veg", description: "Classic chicken in butter sauce" },
    { name: "Palak Paneer", category: "Main Menu", sub_category: "North Indian", price: 260, diet: "veg", description: "Spinach with cottage cheese" },
    { name: "Chole Bhature", category: "Main Menu", sub_category: "North Indian", price: 180, diet: "veg", description: "Chickpea curry with fried bread" },

    // Chinese
    { name: "Veg Hakka Noodles", category: "Main Menu", sub_category: "Chinese", price: 220, diet: "veg", description: "Wok-tossed noodles" },
    { name: "Chicken Manchurian (Gravy)", category: "Main Menu", sub_category: "Chinese", price: 280, diet: "non-veg", description: "Indo-chinese classic" },
    { name: "Schezwan Fried Rice", category: "Main Menu", sub_category: "Chinese", price: 240, diet: "veg", description: "Spicy fried rice" },

    // Mexican
    { name: "Veg Tacos", category: "Main Menu", sub_category: "Mexican", price: 240, diet: "veg", description: "Corn tortillas with beans and salsa" },
    { name: "Chicken Burrito", category: "Main Menu", sub_category: "Mexican", price: 320, diet: "non-veg", description: "Wrapped tortilla with chicken" },

    // Arabic
    { name: "Chicken Shawarma Plate", category: "Main Menu", sub_category: "Arabic", price: 320, diet: "non-veg", description: "Middle eastern delight" },
    { name: "Falafel Wrap", category: "Main Menu", sub_category: "Arabic", price: 220, diet: "veg", description: "Chickpea fritters in pita" },

    // Continental Main
    { name: "Grilled Herb Chicken", category: "Continental", sub_category: "Main Course", price: 450, diet: "non-veg", description: "Herb marinated grilled chicken" },
    { name: "Fish and Chips", category: "Continental", sub_category: "Main Course", price: 420, diet: "non-veg", description: "Battered fish with fries" },
    { name: "Veg Alfredo Pasta", category: "Continental", sub_category: "Pasta & Rice", price: 320, diet: "veg", description: "Pasta in creamy white sauce" },
    { name: "Chicken Carbonara", category: "Continental", sub_category: "Pasta & Rice", price: 380, diet: "non-veg", description: "Creamy pasta with smoked chicken" },
    { name: "Mushroom Risotto", category: "Continental", sub_category: "Pasta & Rice", price: 350, diet: "veg", description: "Italian rice with wild mushrooms" },

    // Fusion
    { name: "Paneer Tikka Pizza", category: "Fusion", sub_category: "Indian Fusion", price: 350, diet: "veg", description: "Indian flavored deep-pan pizza" },
    { name: "Butter Chicken Pizza", category: "Fusion", sub_category: "Indian Fusion", price: 420, diet: "non-veg", description: "Pizza with butter chicken topping" },
    { name: "Thai Green Curry Pasta", category: "Fusion", sub_category: "Asian Fusion", price: 340, diet: "veg", description: "Rice noodles in green curry sauce" },
    { name: "Schezwan Burger", category: "Fusion", sub_category: "Asian Fusion", price: 260, diet: "non-veg", description: "Spicy chinese burger" },
    { name: "Tandoori Chicken Quesadilla", category: "Fusion", sub_category: "Western Fusion", price: 310, diet: "non-veg", description: "Mexican-Indian fusion snack" }
];

// 3. DESSERTS (From seed_desserts_v2.js)
const dessertItems = [
    { name: "Chocolate Cake", category: "Desserts", sub_category: "Cakes", price: 180, image_url: "choco_cake.png", diet: "veg" },
    { name: "Black Forest", category: "Desserts", sub_category: "Cakes", price: 190, image_url: "black_forest.png", diet: "veg" },
    { name: "Red Velvet", category: "Desserts", sub_category: "Cakes", price: 240, image_url: "red_velvet.png", diet: "veg" },
    { name: "Chocolate Brownie", category: "Desserts", sub_category: "Brownies", price: 150, image_url: "brownie.png", diet: "veg" },
    { name: "Walnut Brownie", category: "Desserts", sub_category: "Brownies", price: 200, image_url: "walnut_brownie.png", diet: "veg" },
    { name: "Vanilla Ice Cream", category: "Desserts", sub_category: "Ice Cream", price: 90, image_url: "vanilla_ice.png", diet: "veg" },
    { name: "Chocolate Ice Cream", category: "Desserts", sub_category: "Ice Cream", price: 110, image_url: "choco_ice.png", diet: "veg" },
    { name: "Double Scoop Ice Cream", category: "Desserts", sub_category: "Ice Cream", price: 160, image_url: "double_scoop.png", diet: "veg" },
    { name: "Gulab Jamun", category: "Desserts", sub_category: "Indian Sweets", price: 80, image_url: "gulab_jamun.png", diet: "veg" },
    { name: "Rasgulla", category: "Desserts", sub_category: "Indian Sweets", price: 90, image_url: "rasgulla.png", diet: "veg" },
    { name: "Ras Malai", category: "Desserts", sub_category: "Indian Sweets", price: 140, image_url: "ras_malai.png", diet: "veg" },
    { name: "Jalebi", category: "Desserts", sub_category: "Indian Sweets", price: 100, image_url: "jalebi.png", diet: "veg" },
    { name: "Dessert Combo Plate", category: "Desserts", sub_category: "Combos", price: 350, image_url: "dessert_combo.png", diet: "veg" },
    { name: "Brownie & Shake Combo", category: "Desserts", sub_category: "Combos", price: 320, image_url: "brownie_shake.png", diet: "veg" }
];

// 4. DRINKS (From seed_drinks_complete.js)
const drinkItems = [
    { name: "Regular Tea", category: "Drinks", sub_category: "Classic Tea", price: 40, diet: "veg", description: "Traditional tea" },
    { name: "Masala Tea", category: "Drinks", sub_category: "Flavored Tea", price: 60, diet: "veg", description: "Spiced Indian tea" },
    { name: "Ginger Tea", category: "Drinks", sub_category: "Flavored Tea", price: 55, diet: "veg", description: "Tea with fresh ginger" },
    { name: "Filter Coffee", category: "Drinks", sub_category: "Classic Coffee", price: 70, diet: "veg", description: "South Indian filter coffee" },
    { name: "Cappuccino", category: "Drinks", sub_category: "Milk Coffee", price: 120, diet: "veg", description: "Espresso with steamed milk" },
    { name: "Latte", category: "Drinks", sub_category: "Milk Coffee", price: 130, diet: "veg", description: "Smooth milk coffee" },
    { name: "Cold Brew Coffee", category: "Drinks", sub_category: "Classic Iced Coffee", price: 140, diet: "veg", description: "Smooth cold brew" },
    { name: "Iced Mocha", category: "Drinks", sub_category: "Creamy Iced Coffee", price: 170, diet: "veg", description: "Chocolate iced coffee" },
    { name: "Lemon Iced Tea", category: "Drinks", sub_category: "Classic Iced Tea", price: 80, diet: "veg", description: "Refreshing lemon iced tea" },
    { name: "Peach Iced Tea", category: "Drinks", sub_category: "Classic Iced Tea", price: 90, diet: "veg", description: "Sweet peach iced tea" },
    { name: "Oreo Shake", category: "Drinks", sub_category: "Thick Shakes", price: 160, diet: "veg", description: "Cookies and cream shake" },
    { name: "KitKat Shake", category: "Drinks", sub_category: "Thick Shakes", price: 170, diet: "veg", description: "Chocolate wafer shake" },
    { name: "Mango Shake", category: "Drinks", sub_category: "Fruit Shakes", price: 140, diet: "veg", description: "Tropical mango shake" },
    { name: "Virgin Mojito", category: "Drinks", sub_category: "Citrus Mocktails", price: 150, diet: "veg", description: "Mint and lime mocktail" },
    { name: "Blue Lagoon", category: "Drinks", sub_category: "Fruit Mocktails", price: 170, diet: "veg", description: "Blue curacao mocktail" },
    { name: "Watermelon Juice", category: "Drinks", sub_category: "Fruit Juices", price: 100, diet: "veg", description: "Refreshing watermelon juice" },
    { name: "Sweet Lassi", category: "Drinks", sub_category: "Indian Drinks", price: 80, diet: "veg", description: "Sweet yogurt drink" },
    { name: "Coke", category: "Drinks", sub_category: "Carbonated", price: 50, diet: "veg", description: "Coca-Cola" },
    { name: "Red Bull", category: "Drinks", sub_category: "Energy Drinks", price: 120, diet: "veg", description: "Energy drink" }
];

const allItems = [...starterItems, ...mainItems, ...dessertItems, ...drinkItems];

const seed = async () => {
    db.query("DELETE FROM menu", (err) => {
        if (err) {
            console.error("Error clearing menu:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, price, description, diet, image_url, variants) VALUES ?";
        const values = allItems.map(i => [
            i.name,
            i.category,
            i.sub_category,
            i.price,
            i.description || i.name, // Fallback description
            i.diet || "veg",
            i.image_url || null,
            i.variants ? JSON.stringify(i.variants) : null
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding full restoration:", err);
            } else {
                console.log(`✅ ULTIMATE RESTORATION COMPLETE: ${result.affectedRows} items added.`);
                console.log("Categories:", [...new Set(allItems.map(i => i.category))]);
                console.log("Sub-Categories example:", [...new Set(allItems.map(i => i.sub_category))].slice(0, 5));
            }
            process.exit();
        });
    });
};

seed();
