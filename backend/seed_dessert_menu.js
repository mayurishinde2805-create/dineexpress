const db = require("./config/db");

const dessertItems = [
    // Cakes
    { name: "Chocolate Cake", category: "Desserts", sub_category: "Cakes", price: 150, description: "Rich and moist chocolate cake with ganache.", image_url: "chocolate_cake.png" },
    { name: "Black Forest Cake", category: "Desserts", sub_category: "Cakes", price: 160, description: "Classic black forest with cherries and cream.", image_url: "black_forest.png" },
    { name: "Red Velvet Cake", category: "Desserts", sub_category: "Cakes", price: 180, description: "Elegant red velvet with cream cheese icing.", image_url: "red_velvet.png" },
    { name: "Pineapple Cake", category: "Desserts", sub_category: "Cakes", price: 140, description: "Fresh pineapple infused sponge cake.", image_url: "pineapple_cake.png" },
    { name: "Vanilla Cake", category: "Desserts", sub_category: "Cakes", price: 130, description: "Simple and classic vanilla velvet.", image_url: "vanilla_cake.png" },
    { name: "Strawberry Cake", category: "Desserts", sub_category: "Cakes", price: 150, description: "Sweet strawberry flavored delight.", image_url: "strawberry_cake.png" },
    { name: "Butterscotch Cake", category: "Desserts", sub_category: "Cakes", price: 160, description: "Crunchy butterscotch bits and cream.", image_url: "butterscotch_cake.png" },

    // Brownies
    { name: "Chocolate Brownie", category: "Desserts", sub_category: "Brownies", price: 100, description: "Classic gooey chocolate brownie.", image_url: "brownie.png" },
    { name: "Fudge Brownie", category: "Desserts", sub_category: "Brownies", price: 120, description: "Dense and extra fudgy brownie.", image_url: "fudge_brownie.png" },
    { name: "Walnut Brownie", category: "Desserts", sub_category: "Brownies", price: 130, description: "Brownie topped with crunchy walnuts.", image_url: "walnut_brownie.png" },
    { name: "Choco Lava Brownie", category: "Desserts", sub_category: "Brownies", price: 140, description: "Brownie with a molten chocolate center.", image_url: "lava_brownie.png" },
    { name: "Brownie with Ice Cream", category: "Desserts", sub_category: "Brownies", price: 180, description: "Warm brownie with a scoop of vanilla.", image_url: "brownie_ice_cream.png" },

    // Ice Creams
    { name: "Vanilla Ice Cream", category: "Desserts", sub_category: "Ice Creams", price: 60, variants: JSON.stringify([{ name: "Single Scoop", price: 60 }, { name: "Double Scoop", price: 100 }]), image_url: "vanilla_ice_cream.png" },
    { name: "Chocolate Ice Cream", category: "Desserts", sub_category: "Ice Creams", price: 70, variants: JSON.stringify([{ name: "Single Scoop", price: 70 }, { name: "Double Scoop", price: 120 }]), image_url: "chocolate_ice_cream.png" },
    { name: "Strawberry Ice Cream", category: "Desserts", sub_category: "Ice Creams", price: 60, variants: JSON.stringify([{ name: "Single Scoop", price: 60 }, { name: "Double Scoop", price: 100 }]), image_url: "strawberry_ice_cream.png" },
    { name: "Butterscotch Ice Cream", category: "Desserts", sub_category: "Ice Creams", price: 70, variants: JSON.stringify([{ name: "Single Scoop", price: 70 }, { name: "Double Scoop", price: 120 }]), image_url: "butterscotch_ice_cream.png" },
    { name: "Mango Ice Cream", category: "Desserts", sub_category: "Ice Creams", price: 80, variants: JSON.stringify([{ name: "Single Scoop", price: 80 }, { name: "Double Scoop", price: 140 }]), image_url: "mango_ice_cream.png" },

    // Sundaes & Combos
    { name: "Chocolate Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 180, description: "Mega chocolate sundae with toppings.", image_url: "chocolate_sundae.png" },
    { name: "Brownie Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 210, description: "Brownie bits mixed with cool sundaes.", image_url: "brownie_sundae.png" },
    { name: "Oreo Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 200, description: "Crunchy Oreo pieces in vanilla cream.", image_url: "oreo_sundae.png" },
    { name: "Choco Chips Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 190, description: "Sundae loaded with mini chocolate chips.", image_url: "choco_chip_sundae.png" },
    { name: "Ice Cream with Chocolate Sauce", category: "Desserts", sub_category: "Sundaes & Combos", price: 150, description: "Simple delight with rich syrup.", image_url: "ice_cream_syrup.png" },

    // Milkshakes
    { name: "Chocolate Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 140, image_url: "chocolate_shake.png" },
    { name: "Strawberry Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 130, image_url: "strawberry_shake.png" },
    { name: "Vanilla Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 120, image_url: "vanilla_shake.png" },
    { name: "Oreo Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 160, image_url: "oreo_shake.png" },
    { name: "KitKat Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 170, image_url: "kitkat_shake.png" },
    { name: "Cold Coffee", category: "Desserts", sub_category: "Milkshakes", price: 110, image_url: "cold_coffee.png" },

    // Cookies & Biscuits
    { name: "Chocolate Chip Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 80, description: "Classic cookies with dark chips.", image_url: "choco_cookies.png" },
    { name: "Butter Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 70, description: "Rich and buttery crunch.", image_url: "butter_cookies.png" },
    { name: "Oatmeal Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 90, description: "Healthy and chewy oat cookies.", image_url: "oat_cookies.png" },
    { name: "Double Chocolate Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 100, description: "Xtra chocolatey cookie base.", image_url: "double_choco_cookies.png" },
    { name: "Almond Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 110, description: "Cookies with roasted almond flakes.", image_url: "almond_cookies.png" },

    // Chocolates & Dessert Bites
    { name: "Chocolate Truffle", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 60, image_url: "truffle.png" },
    { name: "Choco Lava Cake", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 120, image_url: "lava_cake.png" },
    { name: "Chocolate Mousse", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 130, image_url: "mousse.png" },
    { name: "Chocolate Fudge", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 90, image_url: "fudge.png" },
    { name: "Chocolate Pastry", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 80, image_url: "pastry.png" },

    // Chef's Special
    { name: "Dessert Combo Plate", category: "Desserts", sub_category: "Chef's Special", price: 350, description: "A bit of everything - Cake, Brownie, Ice Cream.", image_url: "combo_plate.png" },
    { name: "Ice Cream Trio", category: "Desserts", sub_category: "Chef's Special", price: 220, description: "Three distinct scopes of your choice.", image_url: "trio.png" },
    { name: "Brownie & Shake Combo", category: "Desserts", sub_category: "Chef's Special", price: 280, description: "Best of both worlds.", image_url: "brownie_shake.png" },
    { name: "Chef's Special Chocolate Dessert", category: "Desserts", sub_category: "Chef's Special", price: 400, description: "Signature chocolate masterpiece.", image_url: "chef_special.png" }
];

const seed = () => {
    // Clear existing desserts if any to avoid duplicates in this specific seed run
    db.query("DELETE FROM menu WHERE category = 'Desserts'", (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, price, variants, description, image_url) VALUES ?";
        const values = dessertItems.map(item => [
            item.name,
            item.category,
            item.sub_category,
            item.price,
            item.variants || null,
            item.description || null,
            item.image_url
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding desserts:", err);
            } else {
                console.log("Dessert Menu Seeded Successfully:", result.affectedRows, "items added.");
            }
            process.exit();
        });
    });
};

seed();
