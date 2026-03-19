const db = require('./config/db');

const desserts = [
    // --- 🍰 CAKES ---
    { name: "Chocolate Cake", category: "Desserts", sub_category: "Cakes", price: 450, image_url: "chocolate_cake.png", description: "Rich and moist dark chocolate layers." },
    { name: "Black Forest Cake", category: "Desserts", sub_category: "Cakes", price: 480, image_url: "black_forest.png", description: "Classic combination of chocolate and cherries." },
    { name: "Red Velvet Cake", category: "Desserts", sub_category: "Cakes", price: 520, image_url: "red_velvet.png", description: "Crimson-colored cake with cream cheese frosting." },
    { name: "Pineapple Cake", category: "Desserts", sub_category: "Cakes", price: 420, image_url: "pineapple_cake.png", description: "Light sponge with fresh pineapple and cream." },
    { name: "Vanilla Cake", category: "Desserts", sub_category: "Cakes", price: 380, image_url: "vanilla_cake.png", description: "Classic Madagascar vanilla bean flavor." },
    { name: "Strawberry Cake", category: "Desserts", sub_category: "Cakes", price: 450, image_url: "strawberry_cake.png", description: "Fresh strawberry extract and fruit pieces." },
    { name: "Butterscotch Cake", category: "Desserts", sub_category: "Cakes", price: 460, image_url: "butterscotch_cake.png", description: "Crunchy butterscotch bits and caramel drizzle." },

    // --- 🍫 BROWNIES ---
    { name: "Chocolate Brownie", category: "Desserts", sub_category: "Brownies", price: 120, image_url: "brownie.png", description: "Dense and fudgy chocolate goodness." },
    { name: "Fudge Brownie", category: "Desserts", sub_category: "Brownies", price: 140, image_url: "fudge_brownie.png", description: "Extra gooey chocolate fudge texture." },
    { name: "Walnut Brownie", category: "Desserts", sub_category: "Brownies", price: 160, image_url: "walnut_brownie.png", description: "Classic brownie with crunchy roasted walnuts." },
    { name: "Choco Lava Brownie", category: "Desserts", sub_category: "Brownies", price: 180, image_url: "lava_brownie.png", description: "Brownie with a molten chocolate center." },
    { name: "Brownie with Ice Cream", category: "Desserts", sub_category: "Brownies", price: 210, image_url: "brownie_icecream.png", description: "Warm brownie served with cold vanilla scoop." },

    // --- 🍦 ICE CREAMS ---
    { name: "Vanilla Ice Cream", category: "Desserts", sub_category: "Ice Creams", price: 80, image_url: "vanilla_ic.png", description: "Creamy classic vanilla bean." },
    { name: "Chocolate Ice Cream", category: "Desserts", sub_category: "Ice Creams", price: 90, image_url: "choco_ic.png", description: "Pure Belgian chocolate richness." },
    { name: "Strawberry Ice Cream", category: "Desserts", sub_category: "Ice Creams", price: 90, image_url: "strawberry_ic.png", description: "Real strawberry swirls and cream." },
    { name: "Butterscotch Ice Cream", category: "Desserts", sub_category: "Ice Creams", price: 100, image_url: "butterscotch_ic.png", description: "Caramelized sugar and butter crunch." },
    { name: "Mango Ice Cream", category: "Desserts", sub_category: "Ice Creams", price: 110, image_url: "mango_ic.png", description: "Seasonal Alphonso mango pulp." },
    {
        name: "Ice Cream Scoop",
        category: "Desserts",
        sub_category: "Ice Creams",
        price: 80,
        image_url: "scoops.png",
        variants: [
            { name: "Single Scoop", price: 80 },
            { name: "Double Scoop", price: 140 }
        ]
    },

    // --- 🍽️ SUNDAES & COMBOS ---
    { name: "Chocolate Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 220, image_url: "choco_sundae.png", description: "Vanilla ice cream with nuts and rich chocolate sauce." },
    { name: "Brownie Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 250, image_url: "brownie_sundae.png", description: "Warm brownie topped with multiple ice cream flavors." },
    { name: "Oreo Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 230, image_url: "oreo_sundae.png", description: "Crushed Oreos and vanilla cream delight." },
    { name: "Choco Chips Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 230, image_url: "chip_sundae.png", description: "Chocolate chip overload with creamy base." },
    { name: "Ice Cream with Chocolate Sauce", category: "Desserts", sub_category: "Sundaes & Combos", price: 150, image_url: "ic_sauce.png", description: "Simple yet elegant hot chocolate over cold cream." },

    // --- 🥤 MILKSHAKES ---
    { name: "Chocolate Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 160, image_url: "choco_shake.png", description: "Thick and creamy cocoa blend." },
    { name: "Strawberry Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 160, image_url: "strawberry_shake.png", description: "Sweet and refreshing berry shake." },
    { name: "Vanilla Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 150, image_url: "vanilla_shake.png", description: "Classic smooth vanilla milkshake." },
    { name: "Oreo Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 180, image_url: "oreo_shake.png", description: "The ultimate cookies and cream shake." },
    { name: "KitKat Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 190, image_url: "kitkat_shake.png", description: "Crunchy KitKat bars blended to perfection." },
    { name: "Cold Coffee", category: "Desserts", sub_category: "Cold Coffee", price: 140, image_url: "cold_coffee.png", description: "Perfectly brewed and chilled caffeine kick." },

    // --- 🍪 COOKIES & BISCUITS ---
    { name: "Chocolate Chip Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 90, image_url: "choco_cookie.png", description: "Soft centered with melting chocolate chips." },
    { name: "Butter Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 80, image_url: "butter_cookie.png", description: "Crispy, rich buttery biscuits." },
    { name: "Oatmeal Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 100, image_url: "oat_cookie.png", description: "Healty oats with a hint of cinnamon." },
    { name: "Double Chocolate Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 110, image_url: "double_choco.png", description: "Dark chocolate base with white chocolate chips." },
    { name: "Almond Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 120, image_url: "almond_cookie.png", description: "Nutty and crunchy almond delight." },

    // --- 🍫 DESSERT BITES ---
    { name: "Chocolate Truffle", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 150, image_url: "truffle.png", description: "Silky smooth ganache coated in cocoa." },
    { name: "Choco Lava Cake", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 180, image_url: "lava_cake.png", description: "The classic molten chocolate center cake." },
    { name: "Chocolate Mousse", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 160, image_url: "mousse.png", description: "Light and airy chocolate cloud." },
    { name: "Chocolate Fudge", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 140, image_url: "fudge_bites.png", description: "Dense blocks of sweet chocolate fudge." },
    { name: "Chocolate Pastry", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 120, image_url: "pastry.png", description: "Individual serving of our signature cake." },

    // --- ⭐ CHEF'S SPECIAL ---
    { name: "Dessert Combo Plate", category: "Desserts", sub_category: "Chef's Special", price: 450, image_url: "combo_plate.png", description: "A sampler of our best brownies, cakes, and ice cream." },
    { name: "Ice Cream Trio", category: "Desserts", sub_category: "Chef's Special", price: 320, image_url: "ic_trio.png", description: "Three unique artisanal flavors from our chef." },
    { name: "Brownie & Shake Combo", category: "Desserts", sub_category: "Chef's Special", price: 380, image_url: "brownie_shake.png", description: "A hot brownie served with a chilled chocolate shake." },
    { name: "Chef's Special Chocolate Dessert", category: "Desserts", sub_category: "Chef's Special", price: 550, image_url: "special_choco.png", description: "Our secret recipe with 24K gold leaf and hazelnut." },
];

const seed = async () => {
    // We don't clear the whole table, only existing Desserts to be safe
    db.query("DELETE FROM menu WHERE category = 'Desserts'", (err) => {
        if (err) {
            console.error("Error clearing Desserts:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, price, image_url, description, variants) VALUES ?";
        const values = desserts.map(i => [
            i.name,
            i.category,
            i.sub_category,
            i.price,
            i.image_url,
            i.description || null,
            i.variants ? JSON.stringify(i.variants) : null
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding desserts:", err);
            } else {
                console.log(`Premium Desserts Seeded Successfully: ${result.affectedRows} items added.`);
            }
            process.exit();
        });
    });
};

seed();
