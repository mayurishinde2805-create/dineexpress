const db = require('./config/db');

const drinks = [
    // --- ☕ HOT TEA ---
    { name: "Classic Masala Chai", category: "Drinks", sub_category: "Hot Tea", price: 60, image_url: "masala_chai.png", description: "Traditional Indian tea with spices and milk." },
    { name: "Assam Black Tea", category: "Drinks", sub_category: "Hot Tea", price: 50, image_url: "assam_tea.png", description: "Strong and malty premium black tea." },
    { name: "Green Tea (Matcha)", category: "Drinks", sub_category: "Hot Tea", price: 80, image_url: "green_tea.png", description: "Pure antioxidants from premium tea leaves." },
    { name: "Earl Grey Tea", category: "Drinks", sub_category: "Hot Tea", price: 70, image_url: "earl_grey.png", description: "Flavored with oil of bergamot." },
    { name: "Hibiscus Herbal Tea", category: "Drinks", sub_category: "Hot Tea", price: 90, image_url: "hibiscus_tea.png", description: "Caffeine-free tart and floral tea." },
    { name: "Ginger Lemon Tea", category: "Drinks", sub_category: "Hot Tea", price: 75, image_url: "ginger_lemon.png", description: "Perfect for digestion and immunity." },

    // --- ☕ HOT COFFEE ---
    { name: "Classic Espresso", category: "Drinks", sub_category: "Hot Coffee", price: 90, image_url: "espresso.png", description: "Concentrated coffee shot for the purists." },
    { name: "Creamy Cappuccino", category: "Drinks", sub_category: "Hot Coffee", price: 140, image_url: "cappuccino.png", description: "Balanced espresso, steamed milk, and foam." },
    { name: "Cafe Latte", category: "Drinks", sub_category: "Hot Coffee", price: 150, image_url: "latte.png", description: "Mild coffee with lots of steamed milk." },
    { name: "Vanilla Hazelnut Latte", category: "Drinks", sub_category: "Hot Coffee", price: 180, image_url: "vanilla_hazelnut.png", description: "Latte with premium nut and bean extracts." },
    { name: "Mocha Macchiato", category: "Drinks", sub_category: "Hot Coffee", price: 170, image_url: "mocha.png", description: "Chocolate flavored espresso delight." },

    // --- 🧊 ICED COFFEE ---
    { name: "Classic Cold Coffee", category: "Drinks", sub_category: "Iced Coffee", price: 120, image_url: "cold_coffee.png", description: "Smooth and chilled coffee blend." },
    { name: "Caramel Frappuccino", category: "Drinks", sub_category: "Iced Coffee", price: 190, image_url: "caramel_frap.png", description: "Blended ice coffee with caramel drizzle." },
    { name: "Vietnamese Iced Coffee", category: "Drinks", sub_category: "Iced Coffee", price: 160, image_url: "viet_coffee.png", description: "Strong brew with condensed milk." },
    { name: "Iced Americano", category: "Drinks", sub_category: "Iced Coffee", price: 110, image_url: "iced_americano.png", description: "Chilled espresso over water." },

    // --- 🧊 ICED TEA ---
    { name: "Classic Lemon Iced Tea", category: "Drinks", sub_category: "Iced Tea", price: 90, image_url: "lemon_it.png", description: "Refreshing and tangy summer classic." },
    { name: "Peach Iced Tea", category: "Drinks", sub_category: "Iced Tea", price: 110, image_url: "peach_it.png", description: "Sweet peach infusion with black tea." },
    { name: "Mixed Berry Iced Tea", category: "Drinks", sub_category: "Iced Tea", price: 130, image_url: "berry_it.png", description: "Medley of strawberries, blueberries, and tea." },

    // --- 🥤 MILKSHAKES ---
    { name: "Classic Vanilla Shake", category: "Drinks", sub_category: "Milkshakes", price: 140, image_url: "vanilla_shake.png", description: "Smooth Madagascar vanilla blend." },
    { name: "Dark Chocolate Shake", category: "Drinks", sub_category: "Milkshakes", price: 160, image_url: "dark_choco_shake.png", description: "Intense Belgian chocolate richness." },
    { name: "Mango Thick Shake", category: "Drinks", sub_category: "Milkshakes", price: 180, image_url: "mango_shake.png", description: "Seasonal Alfonso mango pulp." },
    { name: "Strawberry Fruit Shake", category: "Drinks", sub_category: "Milkshakes", price: 170, image_url: "strawberry_shake.png", description: "Fresh berries blended with cream." },

    // --- 🍹 MOCKTAILS ---
    { name: "Classic Virgin Mojito", category: "Drinks", sub_category: "Mocktails", price: 160, image_url: "mojito.png", description: "Mint, lime, and soda refreshment." },
    { name: "Blue Lagoon Mocktail", category: "Drinks", sub_category: "Mocktails", price: 180, image_url: "blue_lagoon.png", description: "Blue curacao with citrus notes." },
    { name: "Watermelon Cooler", category: "Drinks", sub_category: "Mocktails", price: 170, image_url: "watermelon_cooler.png", description: "Chilled watermelon juice with a hint of mint." },
    { name: "Sunrise Mocktail", category: "Drinks", sub_category: "Mocktails", price: 190, image_url: "sunrise.png", description: "Orange juice and grenadine layers." },

    // --- 🧃 FRESH JUICES ---
    { name: "Pure Orange Juice", category: "Drinks", sub_category: "Fresh Juices", price: 120, image_url: "orange_juice.png", description: "Freshly squeezed Valencia oranges." },
    { name: "Classic Watermelon Juice", category: "Drinks", sub_category: "Fresh Juices", price: 100, image_url: "watermelon_juice.png", description: "Hydrating and sweet." },
    { name: "Pineapple Citrus Mix", category: "Drinks", sub_category: "Fresh Juices", price: 130, image_url: "pineapple_mix.png", description: "Zesty blend of pineapple and lemon." },
    { name: "ABC Health Juice", category: "Drinks", sub_category: "Fresh Juices", price: 150, image_url: "abc_juice.png", description: "Apple, Beetroot, and Carrot powerhouses." },

    // --- 🥥 TRADITIONAL & HEALTH ---
    { name: "Fresh Coconut Water", category: "Drinks", sub_category: "Traditional & Health Drinks", price: 70, image_url: "coconut_water.png", description: "Natural electrolytes from tender coconuts." },
    { name: "Spiced Buttermilk (Chaas)", category: "Drinks", sub_category: "Traditional & Health Drinks", price: 60, image_url: "chaas.png", description: "Cool and digestive yogurt drink." },
    { name: "Turmeric Gold Milk", category: "Drinks", sub_category: "Traditional & Health Drinks", price: 110, image_url: "haldi_doodh.png", description: "Ancient wellness brew with pepper and honey." },

    // --- 🥤 SOFT DRINKS & ENERGY ---
    { name: "Classic Cola", category: "Drinks", sub_category: "Soft Drinks & Energy Drinks", price: 50, image_url: "cola.png", description: "Chilled 330ml can." },
    { name: "Lemon-Lime Soda", category: "Drinks", sub_category: "Soft Drinks & Energy Drinks", price: 50, image_url: "soda.png", description: "Bubbly and crisp." },
    { name: "Sparkling Energy Drink", category: "Drinks", sub_category: "Soft Drinks & Energy Drinks", price: 110, image_url: "energy_drink.png", description: "Quick caffeine and taurine boost." },
];

const seed = async () => {
    db.query("DELETE FROM menu WHERE category = 'Drinks'", (err) => {
        if (err) {
            console.error("Error clearing Drinks:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, price, image_url, description) VALUES ?";
        const values = drinks.map(i => [
            i.name,
            i.category,
            i.sub_category,
            i.price,
            i.image_url,
            i.description || null
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding drinks:", err);
            } else {
                console.log(`Premium Drinks Seeded Successfully: ${result.affectedRows} items added.`);
            }
            process.exit();
        });
    });
};

seed();
