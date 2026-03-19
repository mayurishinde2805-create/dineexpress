const db = require("./config/db");

const starters = [
    // --- 🟢 VEG STARTERS ---
    // Veg Indian
    { name: "Paneer Pakoda", category: "Starters", sub_category: "Veg Starters", type: "Indian", price: 160, image_url: "paneer_pakoda.png" },
    { name: "Aloo Tikki", category: "Starters", sub_category: "Veg Starters", type: "Indian", price: 120, image_url: "aloo_tikki.png" },
    { name: "Onion Bhaji", category: "Starters", sub_category: "Veg Starters", type: "Indian", price: 110, image_url: "onion_bhaji.png" },
    { name: "Hara Bhara Kebab", category: "Starters", sub_category: "Veg Starters", type: "Indian", price: 210, image_url: "hara_bhara.png" },
    // Veg Chinese
    { name: "Veg Spring Rolls", category: "Starters", sub_category: "Veg Starters", type: "Chinese", price: 180, image_url: "veg_spring_rolls.png" },
    { name: "Veg Manchurian", category: "Starters", sub_category: "Veg Starters", type: "Chinese", price: 190, image_url: "veg_manchurian.png" },
    { name: "Chilli Paneer", category: "Starters", sub_category: "Veg Starters", type: "Chinese", price: 230, image_url: "chilli_paneer.png" },
    { name: "Crispy Baby Corn", category: "Starters", sub_category: "Veg Starters", type: "Chinese", price: 180, image_url: "baby_corn.png" },
    // Veg Tandoor
    { name: "Paneer Tikka", category: "Starters", sub_category: "Veg Starters", type: "Tandoor", price: 240, image_url: "paneer_tikka.png" },
    { name: "Malai Paneer Tikka", category: "Starters", sub_category: "Veg Starters", type: "Tandoor", price: 260, image_url: "malai_paneer.png" },
    { name: "Stuffed Mushroom Tikka", category: "Starters", sub_category: "Veg Starters", type: "Tandoor", price: 250, image_url: "stuffed_mushroom.png" },
    // Veg Continental
    { name: "Garlic Bread", category: "Starters", sub_category: "Veg Starters", type: "Continental", price: 150, image_url: "garlic_bread.png" },
    { name: "Cheese Garlic Bread", category: "Starters", sub_category: "Veg Starters", type: "Continental", price: 180, image_url: "cheese_garlic.png" },
    { name: "French Fries", category: "Starters", sub_category: "Veg Starters", type: "Continental", price: 120, image_url: "fries.png" },
    { name: "Potato Wedges", category: "Starters", sub_category: "Veg Starters", type: "Continental", price: 140, image_url: "wedges.png" },
    { name: "Nachos with Cheese", category: "Starters", sub_category: "Veg Starters", type: "Continental", price: 200, image_url: "nachos.png" },

    // --- 🔴 NON-VEG STARTERS ---
    // Non-Veg Indian
    { name: "Chicken Pakoda", category: "Starters", sub_category: "Non-Veg Starters", type: "Indian", price: 220, image_url: "chicken_pakoda.png" },
    { name: "Fish Fry", category: "Starters", sub_category: "Non-Veg Starters", type: "Indian", price: 320, image_url: "fish_fry.png" },
    { name: "Mutton Seekh Kebab", category: "Starters", sub_category: "Non-Veg Starters", type: "Indian", price: 380, image_url: "mutton_seekh.png" },
    // Non-Veg Chinese
    { name: "Chilli Chicken", category: "Starters", sub_category: "Non-Veg Starters", type: "Chinese", price: 290, image_url: "chilli_chicken.png" },
    { name: "Chicken Manchurian", category: "Starters", sub_category: "Non-Veg Starters", type: "Chinese", price: 280, image_url: "chicken_manchurian.png" },
    { name: "Dragon Chicken", category: "Starters", sub_category: "Non-Veg Starters", type: "Chinese", price: 310, image_url: "dragon_chicken.png" },
    { name: "Chicken Spring Rolls", category: "Starters", sub_category: "Non-Veg Starters", type: "Chinese", price: 240, image_url: "chicken_spring_rolls.png" },
    // Non-Veg Tandoor
    { name: "Chicken Tandoori", category: "Starters", sub_category: "Non-Veg Starters", type: "Tandoor", price: 340, image_url: "chicken_tandoori.png" },
    { name: "Chicken Malai Tikka", category: "Starters", sub_category: "Non-Veg Starters", type: "Tandoor", price: 320, image_url: "chicken_malai_tikka.png" },
    { name: "Seekh Kebab", category: "Starters", sub_category: "Non-Veg Starters", type: "Tandoor", price: 300, image_url: "seekh_kebab.png" },
    { name: "Tandoori Fish", category: "Starters", sub_category: "Non-Veg Starters", type: "Tandoor", price: 360, image_url: "tandoori_fish.png" },
    // Non-Veg Continental
    { name: "Chicken Nuggets", category: "Starters", sub_category: "Non-Veg Starters", type: "Continental", price: 200, image_url: "chicken_nuggets.png" },
    { name: "Chicken Wings", category: "Starters", sub_category: "Non-Veg Starters", type: "Continental", price: 240, image_url: "chicken_wings.png" },
    { name: "Fish Fingers", category: "Starters", sub_category: "Non-Veg Starters", type: "Continental", price: 260, image_url: "fish_fingers.png" },
    { name: "Crispy Chicken Strips", category: "Starters", sub_category: "Non-Veg Starters", type: "Continental", price: 230, image_url: "chicken_strips.png" }
];

const seed = async () => {
    db.query("DELETE FROM menu WHERE category = 'Starters'", (err) => {
        if (err) {
            console.error("Error clearing starters:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, type, price, image_url) VALUES ?";
        const values = starters.map(i => [
            i.name, i.category, i.sub_category, i.type, i.price, i.image_url
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding starters:", err);
            } else {
                console.log("Ultimate Starters Seeded Successfully:", result.affectedRows, "items added.");
            }
            process.exit();
        });
    });
};

seed();
