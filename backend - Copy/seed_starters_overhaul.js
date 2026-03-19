const db = require("./config/db");

const starterItems = [
    // Veg Starters
    { name: "Veg Spring Rolls", category: "Starters", sub_category: "Veg Starters", price: 180, image_url: "veg_spring_rolls.png" },
    { name: "Paneer Tikka", category: "Starters", sub_category: "Veg Starters", price: 240, image_url: "paneer_tikka.png" },
    { name: "Veg Manchurian", category: "Starters", sub_category: "Veg Starters", price: 190, image_url: "veg_manchurian.png" },
    { name: "Crispy Corn", category: "Starters", sub_category: "Veg Starters", price: 170, image_url: "crispy_corn.png" },
    { name: "Hara Bhara Kebab", category: "Starters", sub_category: "Veg Starters", price: 210, image_url: "hara_bhara.png" },
    { name: "Cheese Balls", category: "Starters", sub_category: "Veg Starters", price: 200, image_url: "cheese_balls.png" },

    // Non-Veg Starters
    { name: "Chicken Tikka", category: "Starters", sub_category: "Non-Veg Starters", price: 280, image_url: "chicken_tikka.png" },
    { name: "Chicken 65", category: "Starters", sub_category: "Non-Veg Starters", price: 260, image_url: "chicken_65.png" },
    { name: "Chicken Lollipop", category: "Starters", sub_category: "Non-Veg Starters", price: 270, image_url: "chicken_lollipop.png" },
    { name: "Fish Fingers", category: "Starters", sub_category: "Non-Veg Starters", price: 320, image_url: "fish_fingers.png" },
    { name: "Prawns Fry", category: "Starters", sub_category: "Non-Veg Starters", price: 380, image_url: "prawns_fry.png" },

    // Indian Starters
    { name: "Paneer Pakoda", category: "Starters", sub_category: "Indian Starters", price: 160, image_url: "paneer_pakoda.png" },
    { name: "Aloo Tikki", category: "Starters", sub_category: "Indian Starters", price: 120, image_url: "aloo_tikki.png" },
    { name: "Onion Bhaji", category: "Starters", sub_category: "Indian Starters", price: 110, image_url: "onion_bhaji.png" },
    { name: "Samosa", category: "Starters", sub_category: "Indian Starters", price: 90, image_url: "samosa.png" },
    { name: "Dahi Kebab", category: "Starters", sub_category: "Indian Starters", price: 220, image_url: "dahi_kebab.png" },

    // Chinese Starters
    { name: "Veg Manchurian", category: "Starters", sub_category: "Chinese Starters", price: 190, image_url: "veg_manchurian_ch.png" },
    { name: "Chilli Paneer", category: "Starters", sub_category: "Chinese Starters", price: 230, image_url: "chilli_paneer.png" },
    { name: "Chilli Chicken", category: "Starters", sub_category: "Chinese Starters", price: 290, image_url: "chilli_chicken.png" },
    { name: "Crispy Baby Corn", category: "Starters", sub_category: "Chinese Starters", price: 180, image_url: "baby_corn.png" },
    { name: "Chicken Spring Roll", category: "Starters", sub_category: "Chinese Starters", price: 210, image_url: "chicken_spring_roll.png" },

    // Tandoor Starters
    { name: "Paneer Tikka (Tandoor)", category: "Starters", sub_category: "Tandoor Starters", price: 240, image_url: "paneer_tikka_tan.png" },
    { name: "Malai Paneer Tikka", category: "Starters", sub_category: "Tandoor Starters", price: 260, image_url: "malai_paneer.png" },
    { name: "Chicken Tandoori", category: "Starters", sub_category: "Tandoor Starters", price: 340, image_url: "chicken_tandoori.png" },
    { name: "Chicken Malai Tikka", category: "Starters", sub_category: "Tandoor Starters", price: 320, image_url: "malai_tikka.png" },
    { name: "Seekh Kebab", category: "Starters", sub_category: "Tandoor Starters", price: 350, image_url: "seekh_kebab.png" },

    // Continental Starters
    { name: "Garlic Bread", category: "Starters", sub_category: "Continental Starters", price: 150, image_url: "garlic_bread.png" },
    { name: "Cheese Garlic Bread", category: "Starters", sub_category: "Continental Starters", price: 180, image_url: "cheese_garlic.png" },
    { name: "French Fries", category: "Starters", sub_category: "Continental Starters", price: 120, image_url: "fries.png" },
    { name: "Potato Wedges", category: "Starters", sub_category: "Continental Starters", price: 140, image_url: "wedges.png" },
    { name: "Nachos with Cheese", category: "Starters", sub_category: "Continental Starters", price: 200, image_url: "nachos.png" },

    // Chef's Special Starters
    { name: "Mixed Starter Platter", category: "Starters", sub_category: "Chef's Special Starters", price: 550, image_url: "mix_platter.png" },
    { name: "Veg Starter Combo", category: "Starters", sub_category: "Chef's Special Starters", price: 450, image_url: "veg_combo.png" },
    { name: "Non-Veg Starter Combo", category: "Starters", sub_category: "Chef's Special Starters", price: 650, image_url: "non_veg_combo.png" },
    { name: "Chef's Special Tandoor Platter", category: "Starters", sub_category: "Chef's Special Starters", price: 750, image_url: "tandoor_platter.png" }
];

const seed = async () => {
    // We filter out existing Starters to avoid duplicates if possible, or just append
    // For this overhaul, we will clear current Starters
    db.query("DELETE FROM menu WHERE category = 'Starters'", (err) => {
        if (err) {
            console.error("Error clearing starters:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, price, image_url) VALUES ?";
        const values = starterItems.map(i => [
            i.name, i.category, i.sub_category, i.price, i.image_url
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding overhauled starters:", err);
            } else {
                console.log("Premium Starters Seeded Successfully:", result.affectedRows, "items added.");
            }
            process.exit();
        });
    });
};

seed();
