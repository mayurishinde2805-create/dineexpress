const db = require("./config/db");

const menuItems = [
    // Vegetarian Starters
    { name: "Royal Paneer Tikka", category: "Starters", sub_category: "Vegetarian Starters", price: 240, variants: JSON.stringify([{ name: "Half", price: 140 }, { name: "Full", price: 240 }]), description: "Soft paneer cubes marinated in premium spices.", image_url: "paneer_tikka.png" },
    { name: "Cheese Burst Corn Balls", category: "Starters", sub_category: "Vegetarian Starters", price: 180, variants: JSON.stringify([{ name: "Half", price: 100 }, { name: "Full", price: 180 }]), description: "Crunchy corn balls filled with melting cheese.", image_url: "corn_balls.png" },
    { name: "Crispy Golden Baby Corn", category: "Starters", sub_category: "Vegetarian Starters", price: 160, variants: JSON.stringify([{ name: "Half", price: 90 }, { name: "Full", price: 160 }]), description: "Tempura fried baby corn tossed in gold sauce.", image_url: "baby_corn.png" },
    { name: "Tandoori Veg Platter", category: "Starters", sub_category: "Vegetarian Starters", price: 450, variants: JSON.stringify([{ name: "Full", price: 450 }]), description: "Chef's selection of tandoori chargrilled vegetables.", image_url: "veg_platter.png" },
    { name: "Masala Cheese Fingers", category: "Starters", sub_category: "Vegetarian Starters", price: 190, variants: JSON.stringify([{ name: "Half", price: 110 }, { name: "Full", price: 190 }]), description: "Spicy and cheesy finger snacks.", image_url: "cheese_fingers.png" },
    { name: "Spicy Mushroom Delight", category: "Starters", sub_category: "Vegetarian Starters", price: 210, variants: JSON.stringify([{ name: "Half", price: 120 }, { name: "Full", price: 210 }]), description: "Succulent mushrooms tossed in fiery masala.", image_url: "mushroom_delight.png" },
    { name: "Hara Bhara Nawabi Kebab", category: "Starters", sub_category: "Vegetarian Starters", price: 220, variants: JSON.stringify([{ name: "Half", price: 130 }, { name: "Full", price: 220 }]), description: "Premium spinach and pea kebabs.", image_url: "hara_bhara.png" },
    { name: "Chilli Paneer Magic", category: "Starters", sub_category: "Vegetarian Starters", price: 230, variants: JSON.stringify([{ name: "Half", price: 135 }, { name: "Full", price: 230 }]), description: "DineExpress special chilli paneer.", image_url: "chilli_paneer.png" },
    { name: "Stuffed Aloo Shots", category: "Starters", sub_category: "Vegetarian Starters", price: 170, variants: JSON.stringify([{ name: "Half", price: 100 }, { name: "Full", price: 170 }]), description: "Creamy stuffed potato bites.", image_url: "aloo_shots.png" },
    { name: "Peri-Peri Veg Pops", category: "Starters", sub_category: "Vegetarian Starters", price: 150, variants: JSON.stringify([{ name: "Half", price: 85 }, { name: "Full", price: 150 }]), description: "Zesty peri-peri flavored veg nuggets.", image_url: "veg_pops.png" },

    // Non-Vegetarian Starters
    { name: "Classic Chicken Tikka", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 280, variants: JSON.stringify([{ name: "Half", price: 160 }, { name: "Full", price: 280 }]), description: "Authentic chargrilled chicken delights.", image_url: "chicken_tikka.png" },
    { name: "Dragon Chicken Bites", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 310, variants: JSON.stringify([{ name: "Half", price: 180 }, { name: "Full", price: 310 }]), description: "Spicy Indo-Chinese dragon chicken.", image_url: "dragon_chicken.png" },
    { name: "Crispy Chicken Lollipop", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 260, variants: JSON.stringify([{ name: "Half", price: 150 }, { name: "Full", price: 260 }]), description: "Everyone's favorite crispy lollipop.", image_url: "chicken_lollipop.png" },
    { name: "Chicken 65 Reloaded", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 270, variants: JSON.stringify([{ name: "Half", price: 155 }, { name: "Full", price: 270 }]), description: "Classic spicy Chicken 65 with a twist.", image_url: "chicken_65.png" },
    { name: "Spicy Chicken Wings", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 190, variants: JSON.stringify([{ name: "Half", price: 110 }, { name: "Full", price: 190 }]), description: "Juicy wings tossed in hot sauce.", image_url: "chicken_wings.png" },
    { name: "Pepper Chicken Fry", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 280, variants: JSON.stringify([{ name: "Half", price: 165 }, { name: "Full", price: 280 }]), description: "South Indian style black pepper chicken.", image_url: "pepper_chicken.png" },
    { name: "Chicken Manchurian Supreme", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 260, variants: JSON.stringify([{ name: "Half", price: 150 }, { name: "Full", price: 260 }]), description: "Succulent chicken in Manchurian gravy.", image_url: "chicken_manchurian.png" },
    { name: "Tandoori Chicken Angara", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 340, variants: JSON.stringify([{ name: "Half", price: 190 }, { name: "Full", price: 340 }]), description: "Hot and smoky tandoori chicken.", image_url: "tandoori_chicken.png" },
    { name: "Fish Fry Coastal Style", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 350, variants: JSON.stringify([{ name: "Full", price: 350 }]), description: "Premium sea fish fried coastal style.", image_url: "fish_fry.png" },
    { name: "Prawn Pepper Toss", category: "Starters", sub_category: "Non-Vegetarian Starters", price: 380, variants: JSON.stringify([{ name: "Full", price: 380 }]), description: "Juicy prawns tossed with black pepper.", image_url: "prawn_pepper.png" },

    // Continental / Fusion Starters
    { name: "Cheesy Garlic Bread Supreme", category: "Starters", sub_category: "Continental / Fusion Starters", price: 160, variants: JSON.stringify([{ name: "Full", price: 160 }]), description: "Loaded with cheese and herbs.", image_url: "garlic_bread.png" },
    { name: "Loaded Nacho Crunch", category: "Starters", sub_category: "Continental / Fusion Starters", price: 180, variants: JSON.stringify([{ name: "Full", price: 180 }]), description: "Nachos with salsa and cheese sauce.", image_url: "nachos.png" },
    { name: "Peri-Peri French Fries", category: "Starters", sub_category: "Continental / Fusion Starters", price: 120, variants: JSON.stringify([{ name: "Full", price: 120 }]), description: "Spicy peri-peri seasoned fries.", image_url: "fries.png" },
    { name: "Chicken Cheese Nachos", category: "Starters", sub_category: "Continental / Fusion Starters", price: 220, variants: JSON.stringify([{ name: "Full", price: 220 }]), description: "Chicken loaded nachos.", image_url: "chicken_nachos.png" },
    { name: "Crispy Onion Rings", category: "Starters", sub_category: "Continental / Fusion Starters", price: 140, variants: JSON.stringify([{ name: "Full", price: 140 }]), description: "Golden fried onion rings.", image_url: "onion_rings.png" },
    { name: "Chicken Nuggets Crunchy", category: "Starters", sub_category: "Continental / Fusion Starters", price: 180, variants: JSON.stringify([{ name: "Full", price: 180 }]), description: "Crunchy bite-sized chicken snacks.", image_url: "chicken_nuggets.png" },
    { name: "BBQ Chicken Bites", category: "Starters", sub_category: "Continental / Fusion Starters", price: 240, variants: JSON.stringify([{ name: "Full", price: 240 }]), description: "Chicken tossed in smoky BBQ sauce.", image_url: "bbq_chicken.png" },
    { name: "Mexican Veg Quesadilla", category: "Starters", sub_category: "Continental / Fusion Starters", price: 200, variants: JSON.stringify([{ name: "Full", price: 200 }]), description: "Stuffed grilled tortillas.", image_url: "quesadilla.png" },

    // Indian Traditional Starters
    { name: "Punjabi Samosa Delight", category: "Starters", sub_category: "Indian Traditional Starters", price: 80, variants: JSON.stringify([{ name: "Full", price: 80 }]), description: "Perfect golden fried samosas.", image_url: "samosa.png" },
    { name: "Mix Pakora Platter", category: "Starters", sub_category: "Indian Traditional Starters", price: 150, variants: JSON.stringify([{ name: "Full", price: 150 }]), description: "Assorted vegetable pakoras.", image_url: "mix_pakora.png" },
    { name: "Paneer Pakora Crispy", category: "Starters", sub_category: "Indian Traditional Starters", price: 180, variants: JSON.stringify([{ name: "Full", price: 180 }]), description: "Besan coated crisp paneer bites.", image_url: "paneer_pakora.png" },
    { name: "Chicken Pakora Special", category: "Starters", sub_category: "Indian Traditional Starters", price: 210, variants: JSON.stringify([{ name: "Full", price: 210 }]), description: "Spicy fried chicken pakoras.", image_url: "chicken_pakora.png" },
    { name: "Corn & Cheese Cutlet", category: "Starters", sub_category: "Indian Traditional Starters", price: 160, variants: JSON.stringify([{ name: "Full", price: 160 }]), description: "Soft cutlets with corn and cheese.", image_url: "cutlet.png" },
    { name: "Masala Vada Bites", category: "Starters", sub_category: "Indian Traditional Starters", price: 120, variants: JSON.stringify([{ name: "Full", price: 120 }]), description: "South Indian style lentil vadas.", image_url: "vada.png" },

    // Chef’s Special / Signature Starters
    { name: "DineExpress Signature Platter", category: "Starters", sub_category: "Chef’s Special / Signature Starters", price: 599, variants: JSON.stringify([{ name: "Full", price: 599 }]), description: "The ultimate selection of our best appetizers.", image_url: "signature_platter.png" },
    { name: "Chef’s Special Tandoori Mix", category: "Starters", sub_category: "Chef’s Special / Signature Starters", price: 550, variants: JSON.stringify([{ name: "Full", price: 550 }]), description: "Mix of chicken, fish and kebab delights.", image_url: "chef_special_tandoori.png" },
    { name: "Spicy Fusion Starter Basket", category: "Starters", sub_category: "Chef’s Special / Signature Starters", price: 420, variants: JSON.stringify([{ name: "Full", price: 420 }]), description: "A mix of continental and Indian flavors.", image_url: "fusion_basket.png" },
    { name: "Royal Veg Delight Platter", category: "Starters", sub_category: "Chef’s Special / Signature Starters", price: 480, variants: JSON.stringify([{ name: "Full", price: 480 }]), description: "Premium vegetarian celebration platter.", image_url: "royal_veg_platter.png" },
    { name: "Non-Veg Fiesta Platter", category: "Starters", sub_category: "Chef’s Special / Signature Starters", price: 650, variants: JSON.stringify([{ name: "Full", price: 650 }]), description: "The ultimate non-veg lover's choice.", image_url: "nonveg_fiesta.png" }
];

const seed = async () => {
    // Clear existing menu for these categories to avoid duplicates in this specific seed
    // Or just clear all menu if rebuilding
    db.query("DELETE FROM menu", (err) => {
        if (err) console.error(err);

        const sql = "INSERT INTO menu (name, category, sub_category, price, variants, description, image_url) VALUES ?";
        const values = menuItems.map(i => [i.name, i.category, i.sub_category, i.price, i.variants, i.description, i.image_url]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding menu:", err);
            } else {
                console.log("Premium Menu Seeded Successfully:", result.affectedRows, "items added.");
            }
            process.exit();
        });
    });
};

seed();
