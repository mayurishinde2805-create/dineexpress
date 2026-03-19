const db = require("./config/db");

const menuItems = [
    // --- INDIAN (MAIN COURSE) ---
    { name: "Dal Fry", category: "Indian", sub_category: "Veg", price: 120, variants: JSON.stringify([{ name: "Half", price: 70 }, { name: "Full", price: 120 }]), image_url: "dal_fry.png" },
    { name: "Dal Tadka", category: "Indian", sub_category: "Veg", price: 140, variants: JSON.stringify([{ name: "Half", price: 80 }, { name: "Full", price: 140 }]), image_url: "dal_tadka.png" },
    { name: "Jeera Aloo", category: "Indian", sub_category: "Veg", price: 110, variants: JSON.stringify([{ name: "Full", price: 110 }]), image_url: "jeera_aloo.png" },
    { name: "Aloo Matar", category: "Indian", sub_category: "Veg", price: 130, variants: JSON.stringify([{ name: "Full", price: 130 }]), image_url: "aloo_matar.png" },
    { name: "Mix Veg Curry", category: "Indian", sub_category: "Veg", price: 160, variants: JSON.stringify([{ name: "Half", price: 90 }, { name: "Full", price: 160 }]), image_url: "mix_veg.png" },
    { name: "Veg Handi", category: "Indian", sub_category: "Veg", price: 180, variants: JSON.stringify([{ name: "Full", price: 180 }]), image_url: "veg_handi.png" },
    { name: "Chole Masala", category: "Indian", sub_category: "Veg", price: 150, variants: JSON.stringify([{ name: "Full", price: 150 }]), image_url: "chole.png" },

    { name: "Chicken Curry", category: "Indian", sub_category: "Non-Veg", price: 240, variants: JSON.stringify([{ name: "Half", price: 130 }, { name: "Full", price: 240 }]), image_url: "chicken_curry.png" },
    { name: "Chicken Masala", category: "Indian", sub_category: "Non-Veg", price: 260, variants: JSON.stringify([{ name: "Half", price: 140 }, { name: "Full", price: 260 }]), image_url: "chicken_masala.png" },
    { name: "Egg Curry", category: "Indian", sub_category: "Non-Veg", price: 140, variants: JSON.stringify([{ name: "Full", price: 140 }]), image_url: "egg_curry.png" },
    { name: "Mutton Curry", category: "Indian", sub_category: "Non-Veg", price: 350, variants: JSON.stringify([{ name: "Half", price: 190 }, { name: "Full", price: 350 }]), image_url: "mutton_curry.png" },
    { name: "Fish Curry", category: "Indian", sub_category: "Non-Veg", price: 280, variants: JSON.stringify([{ name: "Full", price: 280 }]), image_url: "fish_curry.png" },

    { name: "Steamed Rice", category: "Indian", sub_category: "Rice", price: 80, variants: JSON.stringify([{ name: "Half", price: 45 }, { name: "Full", price: 80 }]), image_url: "steamed_rice.png" },
    { name: "Jeera Rice", category: "Indian", sub_category: "Rice", price: 100, variants: JSON.stringify([{ name: "Half", price: 55 }, { name: "Full", price: 100 }]), image_url: "jeera_rice.png" },
    { name: "Veg Pulao", category: "Indian", sub_category: "Rice", price: 150, variants: JSON.stringify([{ name: "Full", price: 150 }]), image_url: "veg_pulao.png" },

    // --- NORTH INDIAN ---
    { name: "Paneer Butter Masala", category: "North Indian", sub_category: "Veg", price: 240, variants: JSON.stringify([{ name: "Half", price: 135 }, { name: "Full", price: 240 }]), image_url: "pbm.png" },
    { name: "Shahi Paneer", category: "North Indian", sub_category: "Veg", price: 250, variants: JSON.stringify([{ name: "Half", price: 140 }, { name: "Full", price: 250 }]), image_url: "shahi_paneer.png" },
    { name: "Kadai Paneer", category: "North Indian", sub_category: "Veg", price: 230, variants: JSON.stringify([{ name: "Half", price: 130 }, { name: "Full", price: 230 }]), image_url: "kadai_paneer.png" },
    { name: "Paneer Tikka Masala", category: "North Indian", sub_category: "Veg", price: 260, variants: JSON.stringify([{ name: "Full", price: 260 }]), image_url: "ptm.png" },
    { name: "Malai Kofta", category: "North Indian", sub_category: "Veg", price: 220, variants: JSON.stringify([{ name: "Full", price: 220 }]), image_url: "malai_kofta.png" },
    { name: "Veg Kolhapuri", category: "North Indian", sub_category: "Veg", price: 190, variants: JSON.stringify([{ name: "Full", price: 190 }]), image_url: "veg_kolhapuri.png" },

    { name: "Butter Chicken", category: "North Indian", sub_category: "Non-Veg", price: 320, variants: JSON.stringify([{ name: "Half", price: 180 }, { name: "Full", price: 320 }]), image_url: "butter_chicken.png" },
    { name: "Chicken Tikka Masala", category: "North Indian", sub_category: "Non-Veg", price: 310, variants: JSON.stringify([{ name: "Half", price: 175 }, { name: "Full", price: 310 }]), image_url: "ctm.png" },
    { name: "Kadai Chicken", category: "North Indian", sub_category: "Non-Veg", price: 290, variants: JSON.stringify([{ name: "Half", price: 160 }, { name: "Full", price: 290 }]), image_url: "kadai_chicken.png" },
    { name: "Chicken Handi", category: "North Indian", sub_category: "Non-Veg", price: 300, variants: JSON.stringify([{ name: "Full", price: 300 }]), image_url: "chicken_handi.png" },
    { name: "Mutton Rogan Josh", category: "North Indian", sub_category: "Non-Veg", price: 420, variants: JSON.stringify([{ name: "Full", price: 420 }]), image_url: "rogan_josh.png" },

    { name: "Tandoori Roti", category: "North Indian", sub_category: "Breads", price: 20, image_url: "roti.png" },
    { name: "Butter Roti", category: "North Indian", sub_category: "Breads", price: 25, image_url: "butter_roti.png" },
    { name: "Plain Naan", category: "North Indian", sub_category: "Breads", price: 40, image_url: "naan.png" },
    { name: "Butter Naan", category: "North Indian", sub_category: "Breads", price: 50, image_url: "butter_naan.png" },
    { name: "Garlic Naan", category: "North Indian", sub_category: "Breads", price: 60, image_url: "garlic_naan.png" },
    { name: "Kulcha", category: "North Indian", sub_category: "Breads", price: 45, image_url: "kulcha.png" },

    // --- CHINESE ---
    { name: "Veg Manchurian", category: "Chinese", sub_category: "Veg", price: 160, variants: JSON.stringify([{ name: "Half", price: 90 }, { name: "Full", price: 160 }]), image_url: "veg_manchurian.png" },
    { name: "Veg Hakka Noodles", category: "Chinese", sub_category: "Veg", price: 150, variants: JSON.stringify([{ name: "Half", price: 85 }, { name: "Full", price: 150 }]), image_url: "veg_noodles.png" },
    { name: "Veg Fried Rice", category: "Chinese", sub_category: "Veg", price: 150, variants: JSON.stringify([{ name: "Full", price: 150 }]), image_url: "veg_fried_rice.png" },
    { name: "Chilli Paneer", category: "Chinese", sub_category: "Veg", price: 210, variants: JSON.stringify([{ name: "Half", price: 120 }, { name: "Full", price: 210 }]), image_url: "chilli_paneer.png" },
    { name: "Crispy Veg", category: "Chinese", sub_category: "Veg", price: 140, image_url: "crispy_veg.png" },

    { name: "Chicken Manchurian", category: "Chinese", sub_category: "Non-Veg", price: 220, variants: JSON.stringify([{ name: "Half", price: 125 }, { name: "Full", price: 220 }]), image_url: "chicken_manchurian.png" },
    { name: "Chilli Chicken", category: "Chinese", sub_category: "Non-Veg", price: 230, variants: JSON.stringify([{ name: "Half", price: 130 }, { name: "Full", price: 230 }]), image_url: "chilli_chicken.png" },
    { name: "Chicken Hakka Noodles", category: "Chinese", sub_category: "Non-Veg", price: 200, variants: JSON.stringify([{ name: "Half", price: 115 }, { name: "Full", price: 200 }]), image_url: "chicken_noodles.png" },
    { name: "Chicken Fried Rice", category: "Chinese", sub_category: "Non-Veg", price: 210, variants: JSON.stringify([{ name: "Full", price: 210 }]), image_url: "chicken_fried_rice.png" },
    { name: "Chicken Lollipop", category: "Chinese", sub_category: "Non-Veg", price: 190, variants: JSON.stringify([{ name: "Full", price: 190 }]), image_url: "lollipop.png" },

    { name: "Chilli Fish", category: "Chinese", sub_category: "Seafood", price: 320, image_url: "chilli_fish.png" },
    { name: "Fish Manchurian", category: "Chinese", sub_category: "Seafood", price: 340, image_url: "fish_manchurian.png" },
    { name: "Prawn Chilli", category: "Chinese", sub_category: "Seafood", price: 400, image_url: "prawn_chilli.png" },
    { name: "Prawn Fried Rice", category: "Chinese", sub_category: "Seafood", price: 350, image_url: "prawn_rice.png" },

    // --- CONTINENTAL / FUSION ---
    { name: "Veg Pasta", category: "Continental / Fusion", sub_category: "Veg", price: 180, image_url: "veg_pasta.png" },
    { name: "Cheese Pizza", category: "Continental / Fusion", sub_category: "Veg", price: 250, image_url: "cheese_pizza.png" },
    { name: "Veg Burger", category: "Continental / Fusion", sub_category: "Veg", price: 120, image_url: "veg_burger.png" },
    { name: "Garlic Bread", category: "Continental / Fusion", sub_category: "Veg", price: 100, image_url: "garlic_bread.png" },
    { name: "Veg Sandwich", category: "Continental / Fusion", sub_category: "Veg", price: 90, image_url: "veg_sandwich.png" },

    { name: "Chicken Pasta", category: "Continental / Fusion", sub_category: "Non-Veg", price: 220, image_url: "chicken_pasta.png" },
    { name: "Chicken Pizza", category: "Continental / Fusion", sub_category: "Non-Veg", price: 320, image_url: "chicken_pizza.png" },
    { name: "Chicken Burger", category: "Continental / Fusion", sub_category: "Non-Veg", price: 160, image_url: "chicken_burger.png" },
    { name: "Grilled Chicken", category: "Continental / Fusion", sub_category: "Non-Veg", price: 380, image_url: "grilled_chicken.png" },
    { name: "Chicken Sandwich", category: "Continental / Fusion", sub_category: "Non-Veg", price: 140, image_url: "chicken_sandwich.png" },

    // --- CHEF'S SPECIAL ---
    { name: "Special Veg Platter", category: "Chef's Special", sub_category: "Specials", price: 450, image_url: "veg_platter.png" },
    { name: "Special Non-Veg Platter", category: "Chef's Special", sub_category: "Specials", price: 650, image_url: "nonveg_platter.png" },
    { name: "Chef's Special Biryani", category: "Chef's Special", sub_category: "Specials", price: 350, image_url: "special_biryani.png" },
    { name: "House Special Curry", category: "Chef's Special", sub_category: "Specials", price: 400, image_url: "special_curry.png" },

    // --- DESSERTS ---
    { name: "Chocolate Cake", category: "Desserts", sub_category: "Cakes", price: 150, image_url: "choco_cake.png" },
    { name: "Black Forest Cake", category: "Desserts", sub_category: "Cakes", price: 160, image_url: "black_forest.png" },
    { name: "Black Forest Cake", category: "Desserts", sub_category: "Cakes", price: 160, image_url: "black_forest.png" },
    { name: "Chocolate Brownie", category: "Desserts", sub_category: "Brownies", price: 100, image_url: "brownie.png" },
    { name: "Chocolate Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 180, image_url: "sundae.png" },
    { name: "Chocolate Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 140, image_url: "shake.png" },
    { name: "Chocolate Chip Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 80, image_url: "cookies.png" },
    { name: "Chocolate Truffle", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 60, image_url: "truffle.png" },
    { name: "Dessert Combo Plate", category: "Desserts", sub_category: "Chef's Special", price: 350, image_url: "dessert_combo.png" }
];

const seed = () => {
    db.query("DELETE FROM menu", (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, price, variants, image_url) VALUES ?";
        const values = menuItems.map(item => [
            item.name,
            item.category,
            item.sub_category,
            item.price,
            item.variants || null,
            item.image_url
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding master menu:", err);
            } else {
                console.log("Master Menu Seeded Successfully:", result.affectedRows, "items added.");
            }
            process.exit();
        });
    });
};

seed();
