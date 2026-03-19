const db = require("./config/db");

const menuItems = [
    // --- STARTERS (Phase 1) ---
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

    // --- INDIAN (MAIN COURSE) ---
    { name: "Dal Fry", category: "Indian", sub_category: "Veg", price: 120, variants: JSON.stringify([{ name: "Half", price: 70 }, { name: "Full", price: 120 }]), image_url: "dal_fry.png" },
    { name: "Dal Tadka", category: "Indian", sub_category: "Veg", price: 140, image_url: "dal_tadka.png" },
    { name: "Jeera Aloo", category: "Indian", sub_category: "Veg", price: 110, image_url: "jeera_aloo.png" },
    { name: "Aloo Matar", category: "Indian", sub_category: "Veg", price: 130, image_url: "aloo_matar.png" },
    { name: "Mix Veg Curry", category: "Indian", sub_category: "Veg", price: 160, image_url: "mix_veg.png" },
    { name: "Veg Handi", category: "Indian", sub_category: "Veg", price: 180, image_url: "veg_handi.png" },
    { name: "Chole Masala", category: "Indian", sub_category: "Veg", price: 150, image_url: "chole.png" },
    { name: "Chicken Curry", category: "Indian", sub_category: "Non-Veg", price: 240, variants: JSON.stringify([{ name: "Half", price: 130 }, { name: "Full", price: 240 }]), image_url: "chicken_curry.png" },
    { name: "Chicken Masala", category: "Indian", sub_category: "Non-Veg", price: 260, image_url: "chicken_masala.png" },
    { name: "Mutton Curry", category: "Indian", sub_category: "Non-Veg", price: 350, image_url: "mutton_curry.png" },
    { name: "Steamed Rice", category: "Indian", sub_category: "Rice", price: 80, image_url: "rice.png" },
    { name: "Jeera Rice", category: "Indian", sub_category: "Rice", price: 100, image_url: "jeera_rice.png" },

    // --- NORTH INDIAN ---
    { name: "Paneer Butter Masala", category: "North Indian", sub_category: "Veg", price: 240, variants: JSON.stringify([{ name: "Half", price: 135 }, { name: "Full", price: 240 }]), image_url: "pbm.png" },
    { name: "Shahi Paneer", category: "North Indian", sub_category: "Veg", price: 250, image_url: "shahi_paneer.png" },
    { name: "Kadai Paneer", category: "North Indian", sub_category: "Veg", price: 230, image_url: "kadai_paneer.png" },
    { name: "Butter Chicken", category: "North Indian", sub_category: "Non-Veg", price: 320, variants: JSON.stringify([{ name: "Half", price: 180 }, { name: "Full", price: 320 }]), image_url: "butter_chicken.png" },
    { name: "Tandoori Roti", category: "North Indian", sub_category: "Breads", price: 20, image_url: "roti.png" },
    { name: "Butter Naan", category: "North Indian", sub_category: "Breads", price: 50, image_url: "naan.png" },

    // --- CHINESE ---
    { name: "Veg Manchurian", category: "Chinese", sub_category: "Veg", price: 160, image_url: "manchurian.png" },
    { name: "Chicken Hakka Noodles", category: "Chinese", sub_category: "Non-Veg", price: 200, image_url: "noodles.png" },
    { name: "Chilli Fish", category: "Chinese", sub_category: "Seafood", price: 320, image_url: "chilli_fish.png" },

    // --- DESSERTS (Master List) ---
    { name: "Chocolate Cake", category: "Desserts", sub_category: "Cakes", price: 150, image_url: "cake.png" },
    { name: "Chocolate Brownie", category: "Desserts", sub_category: "Brownies", price: 100, image_url: "brownie.png" },
    { name: "Vanilla Ice Cream", category: "Desserts", sub_category: "Ice Creams", price: 60, variants: JSON.stringify([{ name: "Single", price: 60 }, { name: "Double", price: 100 }]), image_url: "ice_cream.png" },
    { name: "Chocolate Sundae", category: "Desserts", sub_category: "Sundaes", price: 180, image_url: "sundae.png" },
    { name: "Oreo Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 160, image_url: "shake.png" },

    // --- DRINKS (Master List) ---
    { name: "Masala Tea", category: "Drinks", sub_category: "Hot Tea", type: "Flavored", price: 40, image_url: "tea.png" },
    { name: "Cappuccino", category: "Drinks", sub_category: "Hot Coffee", type: "Milk-based", price: 110, image_url: "coffee.png" },
    { name: "Cold Brew", category: "Drinks", sub_category: "Iced Coffee", type: "Classic", price: 120, image_url: "cold_brew.png" },
    { name: "Lemon Iced Tea", category: "Drinks", sub_category: "Iced Tea", type: "Classic", price: 90, image_url: "iced_tea.png" }
];

const seed = async () => {
    db.query("DELETE FROM menu", (err) => {
        if (err) console.error(err);

        const sql = "INSERT INTO menu (name, category, sub_category, type, price, variants, image_url) VALUES ?";
        const values = menuItems.map(i => [
            i.name, i.category, i.sub_category, i.type || null, i.price, i.variants || null, i.image_url
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding final master menu:", err);
            } else {
                console.log("Ultimate Master Menu Seeded Successfully:", result.affectedRows, "items added.");
            }
            process.exit();
        });
    });
};

seed();
