const db = require('./config/db');

const drinksItems = [
    // ========================================
    // ☕ TEA
    // ========================================

    // Classic Tea
    { name: "Regular Tea", category: "Drinks", sub_category: "Classic Tea", price: 40, diet: "veg", description: "Traditional tea" },
    { name: "Milk Tea", category: "Drinks", sub_category: "Classic Tea", price: 50, diet: "veg", description: "Tea with milk" },
    { name: "Black Tea", category: "Drinks", sub_category: "Classic Tea", price: 45, diet: "veg", description: "Strong black tea" },
    { name: "Green Tea", category: "Drinks", sub_category: "Classic Tea", price: 60, diet: "veg", description: "Healthy green tea" },

    // Flavored Tea
    { name: "Masala Tea", category: "Drinks", sub_category: "Flavored Tea", price: 60, diet: "veg", description: "Spiced Indian tea" },
    { name: "Ginger Tea", category: "Drinks", sub_category: "Flavored Tea", price: 55, diet: "veg", description: "Tea with fresh ginger" },
    { name: "Cardamom Tea", category: "Drinks", sub_category: "Flavored Tea", price: 55, diet: "veg", description: "Aromatic cardamom tea" },
    { name: "Lemon Tea", category: "Drinks", sub_category: "Flavored Tea", price: 55, diet: "veg", description: "Refreshing lemon tea" },

    // Herbal Tea
    { name: "Tulsi Tea", category: "Drinks", sub_category: "Herbal Tea", price: 70, diet: "veg", description: "Holy basil tea" },
    { name: "Chamomile Tea", category: "Drinks", sub_category: "Herbal Tea", price: 80, diet: "veg", description: "Calming chamomile" },
    { name: "Peppermint Tea", category: "Drinks", sub_category: "Herbal Tea", price: 75, diet: "veg", description: "Refreshing mint tea" },
    { name: "Hibiscus Tea", category: "Drinks", sub_category: "Herbal Tea", price: 75, diet: "veg", description: "Tangy hibiscus tea" },

    // ========================================
    // ☕ COFFEE
    // ========================================

    // Classic Coffee
    { name: "Filter Coffee", category: "Drinks", sub_category: "Classic Coffee", price: 70, diet: "veg", description: "South Indian filter coffee" },
    {
        name: "Americano", category: "Drinks", sub_category: "Classic Coffee", price: 90, diet: "veg", description: "Espresso with hot water",
        variants: [{ name: "Regular", price: 90 }, { name: "Large", price: 130 }]
    },
    {
        name: "Espresso", category: "Drinks", sub_category: "Classic Coffee", price: 80, diet: "veg", description: "Strong espresso shot",
        variants: [{ name: "Single Shot", price: 80 }, { name: "Double Shot", price: 140 }]
    },
    { name: "Black Coffee", category: "Drinks", sub_category: "Classic Coffee", price: 60, diet: "veg", description: "Pure black coffee" },

    // Milk Coffee
    {
        name: "Cappuccino", category: "Drinks", sub_category: "Milk Coffee", price: 120, diet: "veg", description: "Espresso with steamed milk",
        variants: [{ name: "Regular", price: 120 }, { name: "Large", price: 170 }]
    },
    {
        name: "Latte", category: "Drinks", sub_category: "Milk Coffee", price: 130, diet: "veg", description: "Smooth milk coffee",
        variants: [{ name: "Regular", price: 130 }, { name: "Large", price: 180 }]
    },
    { name: "Flat White", category: "Drinks", sub_category: "Milk Coffee", price: 140, diet: "veg", description: "Velvety flat white" },
    {
        name: "Mocha", category: "Drinks", sub_category: "Milk Coffee", price: 150, diet: "veg", description: "Chocolate coffee blend",
        variants: [{ name: "Regular", price: 150 }, { name: "Large", price: 200 }]
    },

    // Special Coffee
    { name: "Chocolate Coffee", category: "Drinks", sub_category: "Special Coffee", price: 160, diet: "veg", description: "Rich chocolate coffee" },
    { name: "Hazelnut Coffee", category: "Drinks", sub_category: "Special Coffee", price: 160, diet: "veg", description: "Nutty hazelnut coffee" },
    { name: "Caramel Coffee", category: "Drinks", sub_category: "Special Coffee", price: 160, diet: "veg", description: "Sweet caramel coffee" },
    { name: "Irish Coffee (Non-Alcoholic)", category: "Drinks", sub_category: "Special Coffee", price: 180, diet: "veg", description: "Irish style coffee" },

    // ========================================
    // ❄️ ICED COFFEE
    // ========================================

    // Classic Iced Coffee
    {
        name: "Iced Black Coffee", category: "Drinks", sub_category: "Classic Iced Coffee", price: 100, diet: "veg", description: "Chilled black coffee",
        variants: [{ name: "Regular", price: 100 }, { name: "Large", price: 150 }]
    },
    {
        name: "Iced Milk Coffee", category: "Drinks", sub_category: "Classic Iced Coffee", price: 120, diet: "veg", description: "Cold milk coffee",
        variants: [{ name: "Regular", price: 120 }, { name: "Large", price: 170 }]
    },
    {
        name: "Cold Brew Coffee", category: "Drinks", sub_category: "Classic Iced Coffee", price: 140, diet: "veg", description: "Smooth cold brew",
        variants: [{ name: "Regular", price: 140 }, { name: "Large", price: 190 }]
    },

    // Creamy Iced Coffee
    {
        name: "Iced Cappuccino", category: "Drinks", sub_category: "Creamy Iced Coffee", price: 150, diet: "veg", description: "Chilled cappuccino",
        variants: [{ name: "Regular", price: 150 }, { name: "Large", price: 200 }]
    },
    {
        name: "Iced Latte", category: "Drinks", sub_category: "Creamy Iced Coffee", price: 160, diet: "veg", description: "Cold latte",
        variants: [{ name: "Regular", price: 160 }, { name: "Large", price: 210 }]
    },
    {
        name: "Iced Mocha", category: "Drinks", sub_category: "Creamy Iced Coffee", price: 170, diet: "veg", description: "Chocolate iced coffee",
        variants: [{ name: "Regular", price: 170 }, { name: "Large", price: 220 }]
    },

    // Flavored Iced Coffee
    { name: "Vanilla Iced Coffee", category: "Drinks", sub_category: "Flavored Iced Coffee", price: 170, diet: "veg", description: "Vanilla flavored iced coffee" },
    { name: "Caramel Iced Coffee", category: "Drinks", sub_category: "Flavored Iced Coffee", price: 170, diet: "veg", description: "Caramel iced coffee" },
    { name: "Chocolate Iced Coffee", category: "Drinks", sub_category: "Flavored Iced Coffee", price: 170, diet: "veg", description: "Chocolate iced coffee" },

    // ========================================
    // 🍹 ICED TEA
    // ========================================

    // Classic Iced Tea
    {
        name: "Lemon Iced Tea", category: "Drinks", sub_category: "Classic Iced Tea", price: 80, diet: "veg", description: "Refreshing lemon iced tea",
        variants: [{ name: "Regular", price: 80 }, { name: "Large", price: 120 }]
    },
    {
        name: "Peach Iced Tea", category: "Drinks", sub_category: "Classic Iced Tea", price: 90, diet: "veg", description: "Sweet peach iced tea",
        variants: [{ name: "Regular", price: 90 }, { name: "Large", price: 130 }]
    },
    { name: "Green Iced Tea", category: "Drinks", sub_category: "Classic Iced Tea", price: 85, diet: "veg", description: "Chilled green tea" },

    // Fruity Iced Tea
    { name: "Strawberry Iced Tea", category: "Drinks", sub_category: "Fruity Iced Tea", price: 100, diet: "veg", description: "Strawberry flavored iced tea" },
    { name: "Raspberry Iced Tea", category: "Drinks", sub_category: "Fruity Iced Tea", price: 100, diet: "veg", description: "Raspberry iced tea" },
    { name: "Mango Iced Tea", category: "Drinks", sub_category: "Fruity Iced Tea", price: 100, diet: "veg", description: "Tropical mango iced tea" },

    // Herbal Iced Tea
    { name: "Mint Iced Tea", category: "Drinks", sub_category: "Herbal Iced Tea", price: 90, diet: "veg", description: "Refreshing mint iced tea" },
    { name: "Hibiscus Iced Tea", category: "Drinks", sub_category: "Herbal Iced Tea", price: 95, diet: "veg", description: "Tangy hibiscus iced tea" },
    { name: "Chamomile Iced Tea", category: "Drinks", sub_category: "Herbal Iced Tea", price: 95, diet: "veg", description: "Calming chamomile iced tea" },

    // ========================================
    // 🥤 MILKSHAKES
    // ========================================

    // Classic Shakes
    {
        name: "Vanilla Shake", category: "Drinks", sub_category: "Classic Shakes", price: 120, diet: "veg", description: "Classic vanilla milkshake",
        variants: [{ name: "Regular", price: 120 }, { name: "Large", price: 180 }]
    },
    {
        name: "Chocolate Shake", category: "Drinks", sub_category: "Classic Shakes", price: 130, diet: "veg", description: "Rich chocolate shake",
        variants: [{ name: "Regular", price: 130 }, { name: "Large", price: 190 }]
    },
    {
        name: "Strawberry Shake", category: "Drinks", sub_category: "Classic Shakes", price: 130, diet: "veg", description: "Fresh strawberry shake",
        variants: [{ name: "Regular", price: 130 }, { name: "Large", price: 190 }]
    },

    // Thick Shakes
    {
        name: "Oreo Shake", category: "Drinks", sub_category: "Thick Shakes", price: 160, diet: "veg", description: "Cookies and cream shake",
        variants: [{ name: "Regular", price: 160 }, { name: "Large", price: 220 }]
    },
    {
        name: "KitKat Shake", category: "Drinks", sub_category: "Thick Shakes", price: 170, diet: "veg", description: "Chocolate wafer shake",
        variants: [{ name: "Regular", price: 170 }, { name: "Large", price: 230 }]
    },
    {
        name: "Brownie Shake", category: "Drinks", sub_category: "Thick Shakes", price: 180, diet: "veg", description: "Brownie blended shake",
        variants: [{ name: "Regular", price: 180 }, { name: "Large", price: 240 }]
    },

    // Fruit Shakes
    {
        name: "Mango Shake", category: "Drinks", sub_category: "Fruit Shakes", price: 140, diet: "veg", description: "Tropical mango shake",
        variants: [{ name: "Regular", price: 140 }, { name: "Large", price: 200 }]
    },
    {
        name: "Banana Shake", category: "Drinks", sub_category: "Fruit Shakes", price: 120, diet: "veg", description: "Creamy banana shake",
        variants: [{ name: "Regular", price: 120 }, { name: "Large", price: 180 }]
    },
    {
        name: "Mixed Fruit Shake", category: "Drinks", sub_category: "Fruit Shakes", price: 150, diet: "veg", description: "Assorted fruit shake",
        variants: [{ name: "Regular", price: 150 }, { name: "Large", price: 210 }]
    },

    // ========================================
    // 🍹 MOCKTAILS
    // ========================================

    // Citrus Mocktails
    { name: "Virgin Mojito", category: "Drinks", sub_category: "Citrus Mocktails", price: 150, diet: "veg", description: "Mint and lime mocktail" },
    { name: "Lemon Mint Mojito", category: "Drinks", sub_category: "Citrus Mocktails", price: 160, diet: "veg", description: "Lemon mint refresher" },
    { name: "Citrus Cooler", category: "Drinks", sub_category: "Citrus Mocktails", price: 140, diet: "veg", description: "Mixed citrus drink" },

    // Fruit Mocktails
    { name: "Blue Lagoon", category: "Drinks", sub_category: "Fruit Mocktails", price: 170, diet: "veg", description: "Blue curacao mocktail" },
    { name: "Fruit Punch", category: "Drinks", sub_category: "Fruit Mocktails", price: 160, diet: "veg", description: "Mixed fruit punch" },
    { name: "Watermelon Splash", category: "Drinks", sub_category: "Fruit Mocktails", price: 150, diet: "veg", description: "Fresh watermelon drink" },

    // Refreshing Mocktails
    { name: "Mint Cooler", category: "Drinks", sub_category: "Refreshing Mocktails", price: 130, diet: "veg", description: "Cooling mint drink" },
    { name: "Rose Cooler", category: "Drinks", sub_category: "Refreshing Mocktails", price: 140, diet: "veg", description: "Rose flavored cooler" },
    { name: "Ginger Fizz", category: "Drinks", sub_category: "Refreshing Mocktails", price: 130, diet: "veg", description: "Spicy ginger fizz" },

    // ========================================
    // 🧃 FRESH JUICES
    // ========================================

    // Citrus Juices
    {
        name: "Orange Juice", category: "Drinks", sub_category: "Citrus Juices", price: 100, diet: "veg", description: "Fresh orange juice",
        variants: [{ name: "Regular", price: 100 }, { name: "Large", price: 150 }]
    },
    {
        name: "Sweet Lime Juice", category: "Drinks", sub_category: "Citrus Juices", price: 90, diet: "veg", description: "Sweet lime juice",
        variants: [{ name: "Regular", price: 90 }, { name: "Large", price: 140 }]
    },
    { name: "Lemon Juice", category: "Drinks", sub_category: "Citrus Juices", price: 70, diet: "veg", description: "Fresh lemon juice" },

    // Fruit Juices
    {
        name: "Apple Juice", category: "Drinks", sub_category: "Fruit Juices", price: 110, diet: "veg", description: "Fresh apple juice",
        variants: [{ name: "Regular", price: 110 }, { name: "Large", price: 160 }]
    },
    {
        name: "Pineapple Juice", category: "Drinks", sub_category: "Fruit Juices", price: 120, diet: "veg", description: "Tropical pineapple juice",
        variants: [{ name: "Regular", price: 120 }, { name: "Large", price: 170 }]
    },
    {
        name: "Watermelon Juice", category: "Drinks", sub_category: "Fruit Juices", price: 100, diet: "veg", description: "Refreshing watermelon juice",
        variants: [{ name: "Regular", price: 100 }, { name: "Large", price: 150 }]
    },

    // Mixed Juices
    {
        name: "Mixed Fruit Juice", category: "Drinks", sub_category: "Mixed Juices", price: 130, diet: "veg", description: "Assorted fruit juice",
        variants: [{ name: "Regular", price: 130 }, { name: "Large", price: 180 }]
    },
    { name: "Detox Juice", category: "Drinks", sub_category: "Mixed Juices", price: 150, diet: "veg", description: "Healthy detox blend" },

    // ========================================
    // 🥛 TRADITIONAL & HEALTH DRINKS
    // ========================================

    // Indian Drinks
    { name: "Buttermilk (Chaas)", category: "Drinks", sub_category: "Indian Drinks", price: 60, diet: "veg", description: "Traditional buttermilk" },
    {
        name: "Sweet Lassi", category: "Drinks", sub_category: "Indian Drinks", price: 80, diet: "veg", description: "Sweet yogurt drink",
        variants: [{ name: "Regular", price: 80 }, { name: "Large", price: 130 }]
    },
    {
        name: "Salted Lassi", category: "Drinks", sub_category: "Indian Drinks", price: 80, diet: "veg", description: "Salted yogurt drink",
        variants: [{ name: "Regular", price: 80 }, { name: "Large", price: 130 }]
    },

    // Healthy Drinks
    { name: "Coconut Water", category: "Drinks", sub_category: "Healthy Drinks", price: 70, diet: "veg", description: "Fresh coconut water" },
    { name: "Fruit Smoothie", category: "Drinks", sub_category: "Healthy Drinks", price: 140, diet: "veg", description: "Blended fruit smoothie" },
    { name: "Green Smoothie", category: "Drinks", sub_category: "Healthy Drinks", price: 160, diet: "veg", description: "Healthy green smoothie" },

    // ========================================
    // 🥤 SOFT DRINKS
    // ========================================

    // Carbonated
    { name: "Coke", category: "Drinks", sub_category: "Carbonated", price: 50, diet: "veg", description: "Coca-Cola" },
    { name: "Pepsi", category: "Drinks", sub_category: "Carbonated", price: 50, diet: "veg", description: "Pepsi Cola" },
    { name: "Sprite", category: "Drinks", sub_category: "Carbonated", price: 50, diet: "veg", description: "Lemon-lime soda" },
    { name: "Fanta", category: "Drinks", sub_category: "Carbonated", price: 50, diet: "veg", description: "Orange soda" },

    // Energy Drinks
    { name: "Red Bull", category: "Drinks", sub_category: "Energy Drinks", price: 120, diet: "veg", description: "Energy drink" },
    { name: "Monster", category: "Drinks", sub_category: "Energy Drinks", price: 130, diet: "veg", description: "Monster energy" },
    { name: "Sting", category: "Drinks", sub_category: "Energy Drinks", price: 60, diet: "veg", description: "Sting energy drink" },
];

const updateDrinks = async () => {
    db.query("DELETE FROM menu WHERE category = 'Drinks'", (err) => {
        if (err) {
            console.error("Error clearing drinks:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, price, diet, description, variants) VALUES ?";
        const values = drinksItems.map(i => [
            i.name,
            i.category,
            i.sub_category,
            i.price,
            i.diet,
            i.description,
            i.variants ? JSON.stringify(i.variants) : null
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding drinks:", err);
            } else {
                console.log(`✅ Drinks Menu Updated Successfully: ${result.affectedRows} items added.`);
            }
            process.exit();
        });
    });
};

updateDrinks();
