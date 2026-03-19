const db = require("./config/db");

const menuItems = [
    // --- STARTERS ---
    // Vegetarian Starters
    { name: "Royal Paneer Tikka", category: "Starters", sub_category: "Vegetarian Starters", price: 240, variants: JSON.stringify([{ name: "Half", price: 140 }, { name: "Full", price: 240 }]), image_url: "paneer_tikka.png" },
    { name: "Cheese Burst Corn Balls", category: "Starters", sub_category: "Vegetarian Starters", price: 180, variants: JSON.stringify([{ name: "Half", price: 100 }, { name: "Full", price: 180 }]), image_url: "corn_balls.png" },
    { name: "Crispy Golden Baby Corn", category: "Starters", sub_category: "Vegetarian Starters", price: 160, variants: JSON.stringify([{ name: "Half", price: 90 }, { name: "Full", price: 160 }]), image_url: "baby_corn.png" },
    { name: "Tandoori Veg Platter", category: "Starters", sub_category: "Vegetarian Starters", price: 450, image_url: "veg_platter.png" },
    { name: "Masala Cheese Fingers", category: "Starters", sub_category: "Vegetarian Starters", price: 190, image_url: "cheese_fingers.png" },
    { name: "Spicy Mushroom Delight", category: "Starters", sub_category: "Vegetarian Starters", price: 210, image_url: "mushroom_delight.png" },
    { name: "Hara Bhara Nawabi Kebab", category: "Starters", sub_category: "Vegetarian Starters", price: 220, image_url: "hara_bhara.png" },
    { name: "Chilli Paneer Magic", category: "Starters", sub_category: "Vegetarian Starters", price: 230, image_url: "chilli_paneer.png" },
    { name: "Stuffed Aloo Shots", category: "Starters", sub_category: "Vegetarian Starters", price: 170, image_url: "aloo_shots.png" },
    { name: "Peri-Peri Veg Pops", category: "Starters", sub_category: "Vegetarian Starters", price: 150, image_url: "veg_pops.png" },

    // Non-Vegetarian Starters
    { name: "Classic Chicken Tikka", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 280, variants: JSON.stringify([{ name: "Half", price: 160 }, { name: "Full", price: 280 }]), image_url: "chicken_tikka.png" },
    { name: "Dragon Chicken Bites", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 310, image_url: "dragon_chicken.png" },
    { name: "Crispy Chicken Lollipop", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 260, image_url: "lollipop.png" },
    { name: "Chicken 65 Reloaded", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 270, image_url: "chicken_65.png" },
    { name: "Spicy Chicken Wings", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 190, image_url: "wings.png" },
    { name: "Pepper Chicken Fry", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 280, image_url: "pepper_chicken.png" },
    { name: "Chicken Manchurian Supreme", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 260, image_url: "chicken_manchurian.png" },
    { name: "Tandoori Chicken Angara", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 340, image_url: "tandoori_chicken.png" },
    { name: "Fish Fry Coastal Style", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 350, image_url: "fish_fry.png" },
    { name: "Prawn Pepper Toss", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 380, image_url: "prawns.png" },

    // --- MAIN MENU -> INDIAN ---
    // Veg
    { name: "Dal Fry", category: "Main Menu", sub_category: "Indian - Veg", price: 180, image_url: "dal_fry.png" },
    { name: "Dal Tadka", category: "Main Menu", sub_category: "Indian - Veg", price: 190, image_url: "dal_tadka.png" },
    { name: "Jeera Aloo", category: "Main Menu", sub_category: "Indian - Veg", price: 185, image_url: "jeera_aloo.png" },
    { name: "Aloo Matar", category: "Main Menu", sub_category: "Indian - Veg", price: 200, image_url: "aloo_matar.png" },
    { name: "Mix Veg Curry", category: "Main Menu", sub_category: "Indian - Veg", price: 220, image_url: "mix_veg.png" },
    { name: "Veg Handi", category: "Main Menu", sub_category: "Indian - Veg", price: 240, image_url: "veg_handi.png" },
    { name: "Chole Masala", category: "Main Menu", sub_category: "Indian - Veg", price: 210, image_url: "chole.png" },
    // Non-Veg
    { name: "Chicken Curry", category: "Main Menu", sub_category: "Indian - Non-Veg", price: 280, image_url: "chicken_curry.png" },
    { name: "Chicken Masala", category: "Main Menu", sub_category: "Indian - Non-Veg", price: 300, image_url: "chicken_masala.png" },
    { name: "Egg Curry", category: "Main Menu", sub_category: "Indian - Non-Veg", price: 260, image_url: "egg_curry.png" },
    { name: "Mutton Curry", category: "Main Menu", sub_category: "Indian - Non-Veg", price: 380, image_url: "mutton_curry.png" },
    { name: "Fish Curry", category: "Main Menu", sub_category: "Indian - Non-Veg", price: 340, image_url: "fish_curry.png" },
    // Rice
    { name: "Steamed Rice", category: "Main Menu", sub_category: "Indian - Rice", price: 120, image_url: "steamed_rice.png" },
    { name: "Jeera Rice", category: "Main Menu", sub_category: "Indian - Rice", price: 140, image_url: "jeera_rice.png" },
    { name: "Veg Pulao", category: "Main Menu", sub_category: "Indian - Rice", price: 180, image_url: "veg_pulao.png" },

    // --- MAIN MENU -> NORTH INDIAN ---
    // Veg
    { name: "Paneer Butter Masala", category: "Main Menu", sub_category: "North Indian - Veg", price: 260, image_url: "pbm.png" },
    { name: "Shahi Paneer", category: "Main Menu", sub_category: "North Indian - Veg", price: 280, image_url: "shahi_paneer.png" },
    { name: "Kadai Paneer", category: "Main Menu", sub_category: "North Indian - Veg", price: 270, image_url: "kadai_paneer.png" },
    { name: "Paneer Tikka Masala", category: "Main Menu", sub_category: "North Indian - Veg", price: 320, image_url: "ptm.png" },
    { name: "Malai Kofta", category: "Main Menu", sub_category: "North Indian - Veg", price: 290, image_url: "malai_kofta.png" },
    { name: "Veg Kolhapuri", category: "Main Menu", sub_category: "North Indian - Veg", price: 250, image_url: "veg_kolhapuri.png" },
    // Non-Veg
    { name: "Butter Chicken", category: "Main Menu", sub_category: "North Indian - Non-Veg", price: 380, image_url: "butter_chicken.png" },
    { name: "Chicken Tikka Masala", category: "Main Menu", sub_category: "North Indian - Non-Veg", price: 420, image_url: "ctm.png" },
    { name: "Kadai Chicken", category: "Main Menu", sub_category: "North Indian - Non-Veg", price: 400, image_url: "kadai_chicken.png" },
    { name: "Chicken Handi", category: "Main Menu", sub_category: "North Indian - Non-Veg", price: 390, image_url: "chicken_handi.png" },
    { name: "Mutton Rogan Josh", category: "Main Menu", sub_category: "North Indian - Non-Veg", price: 480, image_url: "rogan_josh.png" },
    // Breads
    { name: "Tandoori Roti", category: "Main Menu", sub_category: "North Indian - Breads", price: 40, image_url: "roti.png" },
    { name: "Butter Roti", category: "Main Menu", sub_category: "North Indian - Breads", price: 50, image_url: "butter_roti.png" },
    { name: "Plain Naan", category: "Main Menu", sub_category: "North Indian - Breads", price: 60, image_url: "naan.png" },
    { name: "Butter Naan", category: "Main Menu", sub_category: "North Indian - Breads", price: 70, image_url: "butter_naan.png" },
    { name: "Garlic Naan", category: "Main Menu", sub_category: "North Indian - Breads", price: 85, image_url: "garlic_naan.png" },
    { name: "Kulcha", category: "Main Menu", sub_category: "North Indian - Breads", price: 90, image_url: "kulcha.png" },

    // --- MAIN MENU -> CHINESE ---
    // Veg
    { name: "Veg Manchurian", category: "Main Menu", sub_category: "Chinese - Veg", price: 200, image_url: "veg_manchurian.png" },
    { name: "Veg Hakka Noodles", category: "Main Menu", sub_category: "Chinese - Veg", price: 210, image_url: "veg_noodles.png" },
    { name: "Veg Fried Rice", category: "Main Menu", sub_category: "Chinese - Veg", price: 190, image_url: "veg_fried_rice.png" },
    { name: "Chilli Paneer", category: "Main Menu", sub_category: "Chinese - Veg", price: 260, image_url: "chilli_paneer_chinese.png" },
    { name: "Crispy Veg", category: "Main Menu", sub_category: "Chinese - Veg", price: 180, image_url: "crispy_veg.png" },
    // Non-Veg
    { name: "Chicken Manchurian", category: "Main Menu", sub_category: "Chinese - Non-Veg", price: 290, image_url: "chicken_manchurian_chinese.png" },
    { name: "Chilli Chicken", category: "Main Menu", sub_category: "Chinese - Non-Veg", price: 320, image_url: "chilli_chicken_chinese.png" },
    { name: "Chicken Hakka Noodles", category: "Main Menu", sub_category: "Chinese - Non-Veg", price: 280, image_url: "chicken_noodles.png" },
    { name: "Chicken Fried Rice", category: "Main Menu", sub_category: "Chinese - Non-Veg", price: 270, image_url: "chicken_fried_rice.png" },
    { name: "Chicken Lollipop", category: "Main Menu", sub_category: "Chinese - Non-Veg", price: 360, image_url: "lollipop_chinese.png" },
    // Seafood
    { name: "Chilli Fish", category: "Main Menu", sub_category: "Chinese - Seafood", price: 420, image_url: "chilli_fish.png" },
    { name: "Fish Manchurian", category: "Main Menu", sub_category: "Chinese - Seafood", price: 440, image_url: "fish_manchurian.png" },
    { name: "Prawn Chilli", category: "Main Menu", sub_category: "Chinese - Seafood", price: 520, image_url: "prawn_chilli.png" },
    { name: "Prawn Fried Rice", category: "Main Menu", sub_category: "Chinese - Seafood", price: 480, image_url: "prawn_rice.png" },

    // --- CONTINENTAL / FUSION ---
    // Veg
    { name: "Veg Pasta", category: "Continental / Fusion", sub_category: "Veg", price: 240, image_url: "veg_pasta.png" },
    { name: "Cheese Pizza", category: "Continental / Fusion", sub_category: "Veg", price: 280, image_url: "cheese_pizza.png" },
    { name: "Veg Burger", category: "Continental / Fusion", sub_category: "Veg", price: 200, image_url: "veg_burger.png" },
    { name: "Garlic Bread", category: "Continental / Fusion", sub_category: "Veg", price: 180, image_url: "garlic_bread.png" },
    { name: "Veg Sandwich", category: "Continental / Fusion", sub_category: "Veg", price: 160, image_url: "veg_sandwich.png" },
    // Non-Veg
    { name: "Chicken Pasta", category: "Continental / Fusion", sub_category: "Non-Veg", price: 320, image_url: "chicken_pasta.png" },
    { name: "Chicken Pizza", category: "Continental / Fusion", sub_category: "Non-Veg", price: 380, image_url: "chicken_pizza.png" },
    { name: "Chicken Burger", category: "Continental / Fusion", sub_category: "Non-Veg", price: 280, image_url: "chicken_burger.png" },
    { name: "Grilled Chicken", category: "Continental / Fusion", sub_category: "Non-Veg", price: 420, image_url: "grilled_chicken.png" },
    { name: "Chicken Sandwich", category: "Continental / Fusion", sub_category: "Non-Veg", price: 240, image_url: "chicken_sandwich.png" },

    // --- DESSERTS ---
    // Cakes
    { name: "Chocolate Cake", category: "Desserts", sub_category: "Cakes", price: 180, image_url: "choco_cake.png" },
    { name: "Black Forest", category: "Desserts", sub_category: "Cakes", price: 190, image_url: "black_forest.png" },
    { name: "Red Velvet", category: "Desserts", sub_category: "Cakes", price: 240, image_url: "red_velvet.png" },
    { name: "Pineapple", category: "Desserts", sub_category: "Cakes", price: 160, image_url: "pineapple.png" },
    { name: "Vanilla", category: "Desserts", sub_category: "Cakes", price: 150, image_url: "vanilla_cake.png" },
    { name: "Strawberry", category: "Desserts", sub_category: "Cakes", price: 170, image_url: "strawberry_cake.png" },
    { name: "Butterscotch", category: "Desserts", sub_category: "Cakes", price: 210, image_url: "butterscotch_cake.png" },
    // Brownies
    { name: "Chocolate Brownie", category: "Desserts", sub_category: "Brownies", price: 150, image_url: "brownie.png" },
    { name: "Fudge Brownie", category: "Desserts", sub_category: "Brownies", price: 180, image_url: "fudge_brownie.png" },
    { name: "Walnut Brownie", category: "Desserts", sub_category: "Brownies", price: 200, image_url: "walnut_brownie.png" },
    { name: "Choco Lava Brownie", category: "Desserts", sub_category: "Brownies", price: 220, image_url: "lava_brownie.png" },
    { name: "Brownie with Ice Cream", category: "Desserts", sub_category: "Brownies", price: 260, image_url: "brownie_ice_cream.png" },
    // Ice Cream
    { name: "Vanilla Ice Cream", category: "Desserts", sub_category: "Ice Cream", price: 90, image_url: "vanilla_ice.png" },
    { name: "Chocolate Ice Cream", category: "Desserts", sub_category: "Ice Cream", price: 110, image_url: "choco_ice.png" },
    { name: "Strawberry Ice Cream", category: "Desserts", sub_category: "Ice Cream", price: 100, image_url: "strawberry_ice.png" },
    { name: "Butterscotch Ice Cream", category: "Desserts", sub_category: "Ice Cream", price: 120, image_url: "butterscotch_ice.png" },
    { name: "Mango Ice Cream", category: "Desserts", sub_category: "Ice Cream", price: 130, image_url: "mango_ice.png" },
    { name: "Double Scoop Ice Cream", category: "Desserts", sub_category: "Ice Cream", price: 160, image_url: "double_scoop.png" },
    // Indian Sweets
    { name: "Gulab Jamun", category: "Desserts", sub_category: "Indian Sweets", price: 80, image_url: "gulab_jamun.png" },
    { name: "Rasgulla", category: "Desserts", sub_category: "Indian Sweets", price: 90, image_url: "rasgulla.png" },
    { name: "Ras Malai", category: "Desserts", sub_category: "Indian Sweets", price: 140, image_url: "ras_malai.png" },
    { name: "Jalebi", category: "Desserts", sub_category: "Indian Sweets", price: 100, image_url: "jalebi.png" },
    { name: "Gajar Halwa", category: "Desserts", sub_category: "Indian Sweets", price: 150, image_url: "gajar_halwa.png" },
    { name: "Shrikhand", category: "Desserts", sub_category: "Indian Sweets", price: 120, image_url: "shrikhand.png" },
    { name: "Kulfi", category: "Desserts", sub_category: "Indian Sweets", price: 110, image_url: "kulfi.png" },
    // Combos
    { name: "Dessert Combo Plate", category: "Desserts", sub_category: "Combos", price: 350, image_url: "dessert_combo.png" },
    { name: "Ice Cream Trio", category: "Desserts", sub_category: "Combos", price: 280, image_url: "trio.png" },
    { name: "Brownie & Shake Combo", category: "Desserts", sub_category: "Combos", price: 320, image_url: "brownie_shake.png" },
    { name: "Gulab Jamun with Ice Cream", category: "Desserts", sub_category: "Combos", price: 220, image_url: "gj_icecream.png" },

    // --- DRINKS ---
    // Tea
    { name: "Regular Tea", category: "Drinks", sub_category: "Tea", price: 40, image_url: "tea.png" },
    { name: "Milk Tea", category: "Drinks", sub_category: "Tea", price: 50, image_url: "milk_tea.png" },
    { name: "Green Tea", category: "Drinks", sub_category: "Tea", price: 60, image_url: "green_tea.png" },
    { name: "Masala Tea", category: "Drinks", sub_category: "Tea", price: 70, image_url: "masala_tea.png" },
    { name: "Ginger Tea", category: "Drinks", sub_category: "Tea", price: 70, image_url: "ginger_tea.png" },
    { name: "Lemon Tea", category: "Drinks", sub_category: "Tea", price: 60, image_url: "lemon_tea.png" },
    // Coffee
    { name: "Cappuccino", category: "Drinks", sub_category: "Coffee", price: 120, image_url: "cappuccino.png" },
    { name: "Latte", category: "Drinks", sub_category: "Coffee", price: 130, image_url: "latte.png" },
    { name: "Espresso", category: "Drinks", sub_category: "Coffee", price: 90, image_url: "espresso.png" },
    { name: "Mocha", category: "Drinks", sub_category: "Coffee", price: 140, image_url: "mocha.png" },
    { name: "Caramel Coffee", category: "Drinks", sub_category: "Coffee", price: 160, image_url: "caramel_coffee.png" },
    { name: "Chocolate Coffee", category: "Drinks", sub_category: "Coffee", price: 110, image_url: "chocolate_coffee.png" },
    // Mocktails
    { name: "Virgin Mojito", category: "Drinks", sub_category: "Mocktails", price: 160, image_url: "mojito.png" },
    { name: "Blue Lagoon", category: "Drinks", sub_category: "Mocktails", price: 180, image_url: "blue_lagoon.png" },
    { name: "Fruit Punch", category: "Drinks", sub_category: "Mocktails", price: 210, image_url: "fruit_punch.png" },
    { name: "Watermelon Splash", category: "Drinks", sub_category: "Mocktails", price: 170, image_url: "watermelon_splash.png" },
    { name: "Ginger Fizz", category: "Drinks", sub_category: "Mocktails", price: 150, image_url: "ginger_fizz.png" },
    // Fresh Juices
    { name: "Orange Juice", category: "Drinks", sub_category: "Fresh Juices", price: 120, image_url: "orange_juice.png" },
    { name: "Apple Juice", category: "Drinks", sub_category: "Fresh Juices", price: 150, image_url: "apple_juice.png" },
    { name: "Pineapple Juice", category: "Drinks", sub_category: "Fresh Juices", price: 130, image_url: "pineapple_juice.png" },
    { name: "Watermelon Juice", category: "Drinks", sub_category: "Fresh Juices", price: 110, image_url: "watermelon_juice.png" },
    { name: "Mixed Fruit Juice", category: "Drinks", sub_category: "Fresh Juices", price: 160, image_url: "mixed_fruit.png" },
    { name: "Detox Juice", category: "Drinks", sub_category: "Fresh Juices", price: 180, image_url: "detox.png" },
    // Soft Drinks
    { name: "Coke", category: "Drinks", sub_category: "Soft Drinks", price: 60, image_url: "coke.png" },
    { name: "Pepsi", category: "Drinks", sub_category: "Soft Drinks", price: 60, image_url: "pepsi.png" },
    { name: "Sprite", category: "Drinks", sub_category: "Soft Drinks", price: 60, image_url: "sprite.png" },
    { name: "Fanta", category: "Drinks", sub_category: "Soft Drinks", price: 60, image_url: "fanta.png" },
    { name: "Red Bull", category: "Drinks", sub_category: "Soft Drinks", price: 120, image_url: "redbull.png" },
    { name: "Monster", category: "Drinks", sub_category: "Soft Drinks", price: 120, image_url: "monster.png" }
];

const seed = async () => {
    db.query("DELETE FROM menu", (err) => {
        if (err) {
            console.error("Error clearing menu:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, price, variants, image_url) VALUES ?";
        const values = menuItems.map(i => [
            i.name, i.category, i.sub_category, i.price, i.variants || null, i.image_url
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding final luxury menu:", err);
            } else {
                console.log("Ultimate Luxury Menu Seeded Successfully:", result.affectedRows, "items added.");
            }
            process.exit();
        });
    });
};

seed();
