const db = require("./config/db");

const drinkItems = [
    // --- HOT TEA ---
    { name: "Regular Tea", category: "Drinks", sub_category: "Hot Tea", type: "Classic", price: 30, variants: JSON.stringify([{ name: "Cup", price: 30 }, { name: "Pot", price: 50 }]), image_url: "tea.png" },
    { name: "Milk Tea", category: "Drinks", sub_category: "Hot Tea", type: "Classic", price: 35, image_url: "milk_tea.png" },
    { name: "Black Tea", category: "Drinks", sub_category: "Hot Tea", type: "Classic", price: 25, image_url: "black_tea.png" },
    { name: "Green Tea", category: "Drinks", sub_category: "Hot Tea", type: "Classic", price: 40, image_url: "green_tea.png" },

    { name: "Masala Tea", category: "Drinks", sub_category: "Hot Tea", type: "Flavored", price: 40, image_url: "masala_tea.png" },
    { name: "Ginger Tea", category: "Drinks", sub_category: "Hot Tea", type: "Flavored", price: 40, image_url: "ginger_tea.png" },
    { name: "Cardamom Tea", category: "Drinks", sub_category: "Hot Tea", type: "Flavored", price: 40, image_url: "cardamom_tea.png" },
    { name: "Lemon Tea", category: "Drinks", sub_category: "Hot Tea", type: "Flavored", price: 35, image_url: "lemon_tea.png" },

    { name: "Tulsi Tea", category: "Drinks", sub_category: "Hot Tea", type: "Herbal", price: 45, image_url: "tulsi_tea.png" },
    { name: "Chamomile Tea", category: "Drinks", sub_category: "Hot Tea", type: "Herbal", price: 60, image_url: "chamomile_tea.png" },
    { name: "Peppermint Tea", category: "Drinks", sub_category: "Hot Tea", type: "Herbal", price: 55, image_url: "peppermint_tea.png" },
    { name: "Hibiscus Tea", category: "Drinks", sub_category: "Hot Tea", type: "Herbal", price: 60, image_url: "hibiscus_tea.png" },

    // --- HOT COFFEE ---
    { name: "Filter Coffee", category: "Drinks", sub_category: "Hot Coffee", type: "Classic", price: 50, image_url: "filter_coffee.png" },
    { name: "Americano", category: "Drinks", sub_category: "Hot Coffee", type: "Classic", price: 70, image_url: "americano.png" },
    { name: "Espresso", category: "Drinks", sub_category: "Hot Coffee", type: "Classic", price: 60, image_url: "espresso.png" },
    { name: "Black Coffee", category: "Drinks", sub_category: "Hot Coffee", type: "Classic", price: 50, image_url: "black_coffee.png" },

    { name: "Cappuccino", category: "Drinks", sub_category: "Hot Coffee", type: "Milk-based", price: 110, image_url: "cappuccino.png" },
    { name: "Latte", category: "Drinks", sub_category: "Hot Coffee", type: "Milk-based", price: 120, image_url: "latte.png" },
    { name: "Flat White", category: "Drinks", sub_category: "Hot Coffee", type: "Milk-based", price: 130, image_url: "flat_white.png" },
    { name: "Mocha", category: "Drinks", sub_category: "Hot Coffee", type: "Milk-based", price: 140, image_url: "mocha.png" },

    { name: "Chocolate Coffee", category: "Drinks", sub_category: "Hot Coffee", type: "Special", price: 150, image_url: "choco_coffee.png" },
    { name: "Hazelnut Coffee", category: "Drinks", sub_category: "Hot Coffee", type: "Special", price: 160, image_url: "hazelnut_coffee.png" },
    { name: "Caramel Coffee", category: "Drinks", sub_category: "Hot Coffee", type: "Special", price: 160, image_url: "caramel_coffee.png" },
    { name: "Irish Coffee", category: "Drinks", sub_category: "Hot Coffee", type: "Special", price: 180, image_url: "irish_coffee.png" },

    // --- ICED COFFEE ---
    { name: "Iced Black Coffee", category: "Drinks", sub_category: "Iced Coffee", type: "Classic", price: 80, image_url: "iced_black.png" },
    { name: "Iced Milk Coffee", category: "Drinks", sub_category: "Iced Coffee", type: "Classic", price: 100, image_url: "iced_milk.png" },
    { name: "Cold Brew Coffee", category: "Drinks", sub_category: "Iced Coffee", type: "Classic", price: 120, image_url: "cold_brew.png" },

    { name: "Iced Cappuccino", category: "Drinks", sub_category: "Iced Coffee", type: "Creamy", price: 140, image_url: "iced_cappuccino.png" },
    { name: "Iced Latte", category: "Drinks", sub_category: "Iced Coffee", type: "Creamy", price: 150, image_url: "iced_latte.png" },
    { name: "Iced Mocha", category: "Drinks", sub_category: "Iced Coffee", type: "Creamy", price: 160, image_url: "iced_mocha.png" },

    { name: "Vanilla Iced Coffee", category: "Drinks", sub_category: "Iced Coffee", type: "Flavored", price: 160, image_url: "vanilla_iced.png" },
    { name: "Caramel Iced Coffee", category: "Drinks", sub_category: "Iced Coffee", type: "Flavored", price: 170, image_url: "caramel_iced.png" },
    { name: "Chocolate Iced Coffee", category: "Drinks", sub_category: "Iced Coffee", type: "Flavored", price: 170, image_url: "choco_iced.png" },

    // --- ICED TEA ---
    { name: "Lemon Iced Tea", category: "Drinks", sub_category: "Iced Tea", type: "Classic", price: 90, image_url: "lemon_iced_tea.png" },
    { name: "Peach Iced Tea", category: "Drinks", sub_category: "Iced Tea", type: "Classic", price: 100, image_url: "peach_iced_tea.png" },
    { name: "Green Iced Tea", category: "Drinks", sub_category: "Iced Tea", type: "Classic", price: 90, image_url: "green_iced_tea.png" },

    { name: "Strawberry Iced Tea", category: "Drinks", sub_category: "Iced Tea", type: "Fruity", price: 110, image_url: "strawberry_iced_tea.png" },
    { name: "Raspberry Iced Tea", category: "Drinks", sub_category: "Iced Tea", type: "Fruity", price: 110, image_url: "raspberry_iced_tea.png" },
    { name: "Mango Iced Tea", category: "Drinks", sub_category: "Iced Tea", type: "Fruity", price: 120, image_url: "mango_iced_tea.png" },

    { name: "Mint Iced Tea", category: "Drinks", sub_category: "Iced Tea", type: "Herbal", price: 100, image_url: "mint_iced_tea.png" },
    { name: "Hibiscus Iced Tea", category: "Drinks", sub_category: "Iced Tea", type: "Herbal", price: 110, image_url: "hibiscus_iced_tea.png" },
    { name: "Chamomile Iced Tea", category: "Drinks", sub_category: "Iced Tea", type: "Herbal", price: 110, image_url: "chamomile_iced_tea.png" },

    // --- OTHERS ---
    { name: "Classic Vanilla Shake", category: "Drinks", sub_category: "Milkshakes", price: 150, image_url: "vanilla_shake.png" },
    { name: "Classic Fruit Juice", category: "Drinks", sub_category: "Fresh Juices", price: 100, image_url: "fruit_juice.png" },
    { name: "Buttermilk", category: "Drinks", sub_category: "Traditional & Health Drinks", price: 50, image_url: "buttermilk.png" },
    { name: "Coke", category: "Drinks", sub_category: "Soft Drinks & Energy Drinks", price: 40, image_url: "coke.png" }
];

const seed = async () => {
    // We keep existing menu but add these to Drinks category
    db.query("DELETE FROM menu WHERE category = 'Drinks'", (err) => {
        if (err) console.error(err);

        const sql = "INSERT INTO menu (name, category, sub_category, price, variants, image_url) VALUES ?";
        const values = drinkItems.map(i => [i.name, i.category, i.sub_category, i.price, i.variants || null, i.image_url]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding drinks:", err);
            } else {
                console.log("Drinks Menu Seeded Successfully:", result.affectedRows, "items added.");
            }
            process.exit();
        });
    });
};

seed();
