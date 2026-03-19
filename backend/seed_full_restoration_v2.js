const db = require('./config/db');

// ==========================================
// 1. STARTERS (From seed_starters_overhaul.js - FULL LIST)
// ==========================================
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

// ==========================================
// 2. MAIN & CONTINENTAL & FUSION (From seed_complete_menu.js - FULL)
// ==========================================
const mainItems = [
    // Indian
    { name: "Paneer Butter Masala", category: "Main Menu", sub_category: "Indian", price: 280, diet: "veg", description: "Rich tomato gravy with paneer" },
    { name: "Dal Makhani", category: "Main Menu", sub_category: "Indian", price: 220, diet: "veg", description: "Creamy black lentils" },
    { name: "Chicken Biryani", category: "Main Menu", sub_category: "Indian", price: 320, diet: "non-veg", description: "Fragrant basmati rice with chicken" },
    { name: "Mutton Rogan Josh", category: "Main Menu", sub_category: "Indian", price: 420, diet: "non-veg", description: "Kashmiri mutton curry" },

    // North Indian
    { name: "Butter Chicken", category: "Main Menu", sub_category: "North Indian", price: 350, diet: "non-veg", description: "Classic chicken in butter sauce" },
    { name: "Palak Paneer", category: "Main Menu", sub_category: "North Indian", price: 260, diet: "veg", description: "Spinach with cottage cheese" },
    { name: "Chole Bhature", category: "Main Menu", sub_category: "North Indian", price: 180, diet: "veg", description: "Chickpea curry with fried bread" },

    // Chinese
    { name: "Veg Hakka Noodles", category: "Main Menu", sub_category: "Chinese", price: 220, diet: "veg", description: "Wok-tossed noodles" },
    { name: "Chicken Manchurian (Gravy)", category: "Main Menu", sub_category: "Chinese", price: 280, diet: "non-veg", description: "Indo-chinese classic" },
    { name: "Schezwan Fried Rice", category: "Main Menu", sub_category: "Chinese", price: 240, diet: "veg", description: "Spicy fried rice" },

    // Mexican
    { name: "Veg Tacos", category: "Main Menu", sub_category: "Mexican", price: 240, diet: "veg", description: "Corn tortillas with beans and salsa" },
    { name: "Chicken Burrito", category: "Main Menu", sub_category: "Mexican", price: 320, diet: "non-veg", description: "Wrapped tortilla with chicken" },

    // Arabic
    { name: "Chicken Shawarma Plate", category: "Main Menu", sub_category: "Arabic", price: 320, diet: "non-veg", description: "Middle eastern delight" },
    { name: "Falafel Wrap", category: "Main Menu", sub_category: "Arabic", price: 220, diet: "veg", description: "Chickpea fritters in pita" },

    // Continental Main Course
    { name: "Grilled Herb Chicken", category: "Continental", sub_category: "Main Course", price: 450, diet: "non-veg", description: "Herb marinated grilled chicken" },
    { name: "Fish and Chips", category: "Continental", sub_category: "Main Course", price: 420, diet: "non-veg", description: "Battered fish with fries" },

    // Pasta & Rice
    { name: "Veg Alfredo Pasta", category: "Continental", sub_category: "Pasta & Rice", price: 320, diet: "veg", description: "Pasta in creamy white sauce" },
    { name: "Chicken Carbonara", category: "Continental", sub_category: "Pasta & Rice", price: 380, diet: "non-veg", description: "Creamy pasta with smoked chicken" },
    { name: "Mushroom Risotto", category: "Continental", sub_category: "Pasta & Rice", price: 350, diet: "veg", description: "Italian rice with wild mushrooms" },

    // Indian Fusion
    { name: "Paneer Tikka Pizza", category: "Fusion", sub_category: "Indian Fusion", price: 350, diet: "veg", description: "Indian flavored deep-pan pizza" },
    { name: "Butter Chicken Pizza", category: "Fusion", sub_category: "Indian Fusion", price: 420, diet: "non-veg", description: "Pizza with butter chicken topping" },

    // Asian Fusion
    { name: "Thai Green Curry Pasta", category: "Fusion", sub_category: "Asian Fusion", price: 340, diet: "veg", description: "Rice noodles in green curry sauce" },
    { name: "Schezwan Burger", category: "Fusion", sub_category: "Asian Fusion", price: 260, diet: "non-veg", description: "Spicy chinese burger" },

    // Western Fusion
    { name: "Tandoori Chicken Quesadilla", category: "Fusion", sub_category: "Western Fusion", price: 310, diet: "non-veg", description: "Mexican-Indian fusion snack" }
];

// ==========================================
// 3. DESSERTS (From seed_desserts_v2.js - FULL LIST)
// ==========================================
const dessertItems = [
    // Cakes
    { name: "Chocolate Cake", category: "Desserts", sub_category: "Cakes", price: 450, image_url: "chocolate_cake.png", description: "Rich and moist dark chocolate layers." },
    { name: "Black Forest Cake", category: "Desserts", sub_category: "Cakes", price: 480, image_url: "black_forest.png", description: "Classic combination of chocolate and cherries." },
    { name: "Red Velvet Cake", category: "Desserts", sub_category: "Cakes", price: 520, image_url: "red_velvet.png", description: "Crimson-colored cake with cream cheese frosting." },
    { name: "Pineapple Cake", category: "Desserts", sub_category: "Cakes", price: 420, image_url: "pineapple_cake.png", description: "Light sponge with fresh pineapple and cream." },
    { name: "Vanilla Cake", category: "Desserts", sub_category: "Cakes", price: 380, image_url: "vanilla_cake.png", description: "Classic Madagascar vanilla bean flavor." },
    { name: "Strawberry Cake", category: "Desserts", sub_category: "Cakes", price: 450, image_url: "strawberry_cake.png", description: "Fresh strawberry extract and fruit pieces." },
    { name: "Butterscotch Cake", category: "Desserts", sub_category: "Cakes", price: 460, image_url: "butterscotch_cake.png", description: "Crunchy butterscotch bits and caramel drizzle." },

    // Brownies
    { name: "Chocolate Brownie", category: "Desserts", sub_category: "Brownies", price: 120, image_url: "brownie.png", description: "Dense and fudgy chocolate goodness." },
    { name: "Fudge Brownie", category: "Desserts", sub_category: "Brownies", price: 140, image_url: "fudge_brownie.png", description: "Extra gooey chocolate fudge texture." },
    { name: "Walnut Brownie", category: "Desserts", sub_category: "Brownies", price: 160, image_url: "walnut_brownie.png", description: "Classic brownie with crunchy roasted walnuts." },
    { name: "Choco Lava Brownie", category: "Desserts", sub_category: "Brownies", price: 180, image_url: "lava_brownie.png", description: "Brownie with a molten chocolate center." },
    { name: "Brownie with Ice Cream", category: "Desserts", sub_category: "Brownies", price: 210, image_url: "brownie_icecream.png", description: "Warm brownie served with cold vanilla scoop." },

    // Ice Creams
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
        variants: [{ name: "Single Scoop", price: 80 }, { name: "Double Scoop", price: 140 }]
    },

    // Sundaes & Combos
    { name: "Chocolate Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 220, image_url: "choco_sundae.png", description: "Vanilla ice cream with nuts and rich chocolate sauce." },
    { name: "Brownie Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 250, image_url: "brownie_sundae.png", description: "Warm brownie topped with multiple ice cream flavors." },
    { name: "Oreo Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 230, image_url: "oreo_sundae.png", description: "Crushed Oreos and vanilla cream delight." },
    { name: "Choco Chips Sundae", category: "Desserts", sub_category: "Sundaes & Combos", price: 230, image_url: "chip_sundae.png", description: "Chocolate chip overload with creamy base." },
    { name: "Ice Cream with Chocolate Sauce", category: "Desserts", sub_category: "Sundaes & Combos", price: 150, image_url: "ic_sauce.png", description: "Simple yet elegant hot chocolate over cold cream." },

    // Milkshakes
    { name: "Chocolate Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 160, image_url: "choco_shake.png", description: "Thick and creamy cocoa blend." },
    { name: "Strawberry Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 160, image_url: "strawberry_shake.png", description: "Sweet and refreshing berry shake." },
    { name: "Vanilla Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 150, image_url: "vanilla_shake.png", description: "Classic smooth vanilla milkshake." },
    { name: "Oreo Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 180, image_url: "oreo_shake.png", description: "The ultimate cookies and cream shake." },
    { name: "KitKat Milkshake", category: "Desserts", sub_category: "Milkshakes", price: 190, image_url: "kitkat_shake.png", description: "Crunchy KitKat bars blended to perfection." },
    { name: "Cold Coffee", category: "Desserts", sub_category: "Cold Coffee", price: 140, image_url: "cold_coffee.png", description: "Perfectly brewed and chilled caffeine kick." },

    // Cookies & Biscuits
    { name: "Chocolate Chip Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 90, image_url: "choco_cookie.png", description: "Soft centered with melting chocolate chips." },
    { name: "Butter Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 80, image_url: "butter_cookie.png", description: "Crispy, rich buttery biscuits." },
    { name: "Oatmeal Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 100, image_url: "oat_cookie.png", description: "Healty oats with a hint of cinnamon." },
    { name: "Double Chocolate Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 110, image_url: "double_choco.png", description: "Dark chocolate base with white chocolate chips." },
    { name: "Almond Cookies", category: "Desserts", sub_category: "Cookies & Biscuits", price: 120, image_url: "almond_cookie.png", description: "Nutty and crunchy almond delight." },

    // Dessert Bites
    { name: "Chocolate Truffle", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 150, image_url: "truffle.png", description: "Silky smooth ganache coated in cocoa." },
    { name: "Choco Lava Cake", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 180, image_url: "lava_cake.png", description: "The classic molten chocolate center cake." },
    { name: "Chocolate Mousse", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 160, image_url: "mousse.png", description: "Light and airy chocolate cloud." },
    { name: "Chocolate Fudge", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 140, image_url: "fudge_bites.png", description: "Dense blocks of sweet chocolate fudge." },
    { name: "Chocolate Pastry", category: "Desserts", sub_category: "Chocolates & Dessert Bites", price: 120, image_url: "pastry.png", description: "Individual serving of our signature cake." },

    // Chef's Special
    { name: "Dessert Combo Plate", category: "Desserts", sub_category: "Chef's Special", price: 450, image_url: "combo_plate.png", description: "A sampler of our best brownies, cakes, and ice cream." },
    { name: "Ice Cream Trio", category: "Desserts", sub_category: "Chef's Special", price: 320, image_url: "ic_trio.png", description: "Three unique artisanal flavors from our chef." },
    { name: "Brownie & Shake Combo", category: "Desserts", sub_category: "Chef's Special", price: 380, image_url: "brownie_shake.png", description: "A hot brownie served with a chilled chocolate shake." },
    { name: "Chef's Special Chocolate Dessert", category: "Desserts", sub_category: "Chef's Special", price: 550, image_url: "special_choco.png", description: "Our secret recipe with 24K gold leaf and hazelnut." },
];

// ==========================================
// 4. DRINKS (From seed_drinks_complete.js - FULL LIST)
// ==========================================
const drinkItems = [
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

    // Classic Coffee
    { name: "Filter Coffee", category: "Drinks", sub_category: "Classic Coffee", price: 70, diet: "veg", description: "South Indian filter coffee" },
    { name: "Americano", category: "Drinks", sub_category: "Classic Coffee", price: 90, diet: "veg", description: "Espresso with hot water" },
    { name: "Espresso", category: "Drinks", sub_category: "Classic Coffee", price: 80, diet: "veg", description: "Strong espresso shot" },
    { name: "Black Coffee", category: "Drinks", sub_category: "Classic Coffee", price: 60, diet: "veg", description: "Pure black coffee" },

    // Milk Coffee
    { name: "Cappuccino", category: "Drinks", sub_category: "Milk Coffee", price: 120, diet: "veg", description: "Espresso with steamed milk" },
    { name: "Latte", category: "Drinks", sub_category: "Milk Coffee", price: 130, diet: "veg", description: "Smooth milk coffee" },
    { name: "Flat White", category: "Drinks", sub_category: "Milk Coffee", price: 140, diet: "veg", description: "Velvety flat white" },
    { name: "Mocha", category: "Drinks", sub_category: "Milk Coffee", price: 150, diet: "veg", description: "Chocolate coffee blend" },

    // Special Coffee
    { name: "Chocolate Coffee", category: "Drinks", sub_category: "Special Coffee", price: 160, diet: "veg", description: "Rich chocolate coffee" },
    { name: "Hazelnut Coffee", category: "Drinks", sub_category: "Special Coffee", price: 160, diet: "veg", description: "Nutty hazelnut coffee" },
    { name: "Caramel Coffee", category: "Drinks", sub_category: "Special Coffee", price: 160, diet: "veg", description: "Sweet caramel coffee" },
    { name: "Irish Coffee (Non-Alcoholic)", category: "Drinks", sub_category: "Special Coffee", price: 180, diet: "veg", description: "Irish style coffee" },

    // Classic Iced Coffee
    { name: "Iced Black Coffee", category: "Drinks", sub_category: "Classic Iced Coffee", price: 100, diet: "veg", description: "Chilled black coffee" },
    { name: "Iced Milk Coffee", category: "Drinks", sub_category: "Classic Iced Coffee", price: 120, diet: "veg", description: "Cold milk coffee" },
    { name: "Cold Brew Coffee", category: "Drinks", sub_category: "Classic Iced Coffee", price: 140, diet: "veg", description: "Smooth cold brew" },

    // Creamy Iced Coffee
    { name: "Iced Cappuccino", category: "Drinks", sub_category: "Creamy Iced Coffee", price: 150, diet: "veg", description: "Chilled cappuccino" },
    { name: "Iced Latte", category: "Drinks", sub_category: "Creamy Iced Coffee", price: 160, diet: "veg", description: "Cold latte" },
    { name: "Iced Mocha", category: "Drinks", sub_category: "Creamy Iced Coffee", price: 170, diet: "veg", description: "Chocolate iced coffee" },

    // Flavored Iced Coffee
    { name: "Vanilla Iced Coffee", category: "Drinks", sub_category: "Flavored Iced Coffee", price: 170, diet: "veg", description: "Vanilla flavored iced coffee" },
    { name: "Caramel Iced Coffee", category: "Drinks", sub_category: "Flavored Iced Coffee", price: 170, diet: "veg", description: "Caramel iced coffee" },
    { name: "Chocolate Iced Coffee", category: "Drinks", sub_category: "Flavored Iced Coffee", price: 170, diet: "veg", description: "Chocolate iced coffee" },

    // Classic Iced Tea
    { name: "Lemon Iced Tea", category: "Drinks", sub_category: "Classic Iced Tea", price: 80, diet: "veg", description: "Refreshing lemon iced tea" },
    { name: "Peach Iced Tea", category: "Drinks", sub_category: "Classic Iced Tea", price: 90, diet: "veg", description: "Sweet peach iced tea" },
    { name: "Green Iced Tea", category: "Drinks", sub_category: "Classic Iced Tea", price: 85, diet: "veg", description: "Chilled green tea" },

    // Fruity Iced Tea
    { name: "Strawberry Iced Tea", category: "Drinks", sub_category: "Fruity Iced Tea", price: 100, diet: "veg", description: "Strawberry flavored iced tea" },
    { name: "Raspberry Iced Tea", category: "Drinks", sub_category: "Fruity Iced Tea", price: 100, diet: "veg", description: "Raspberry iced tea" },
    { name: "Mango Iced Tea", category: "Drinks", sub_category: "Fruity Iced Tea", price: 100, diet: "veg", description: "Tropical mango iced tea" },

    // Herbal Iced Tea
    { name: "Mint Iced Tea", category: "Drinks", sub_category: "Herbal Iced Tea", price: 90, diet: "veg", description: "Refreshing mint iced tea" },
    { name: "Hibiscus Iced Tea", category: "Drinks", sub_category: "Herbal Iced Tea", price: 95, diet: "veg", description: "Tangy hibiscus iced tea" },
    { name: "Chamomile Iced Tea", category: "Drinks", sub_category: "Herbal Iced Tea", price: 95, diet: "veg", description: "Calming chamomile iced tea" },

    // Stick Shakes (Assuming Typo corrected to Thick Shakes in original file)
    { name: "Vanilla Shake", category: "Drinks", sub_category: "Classic Shakes", price: 120, diet: "veg", description: "Classic vanilla milkshake" },
    { name: "Chocolate Shake", category: "Drinks", sub_category: "Classic Shakes", price: 130, diet: "veg", description: "Rich chocolate shake" },
    { name: "Strawberry Shake", category: "Drinks", sub_category: "Classic Shakes", price: 130, diet: "veg", description: "Fresh strawberry shake" },

    // Thick Shakes
    { name: "Oreo Shake", category: "Drinks", sub_category: "Thick Shakes", price: 160, diet: "veg", description: "Cookies and cream shake" },
    { name: "KitKat Shake", category: "Drinks", sub_category: "Thick Shakes", price: 170, diet: "veg", description: "Chocolate wafer shake" },
    { name: "Brownie Shake", category: "Drinks", sub_category: "Thick Shakes", price: 180, diet: "veg", description: "Brownie blended shake" },

    // Fruit Shakes
    { name: "Mango Shake", category: "Drinks", sub_category: "Fruit Shakes", price: 140, diet: "veg", description: "Tropical mango shake" },
    { name: "Banana Shake", category: "Drinks", sub_category: "Fruit Shakes", price: 120, diet: "veg", description: "Creamy banana shake" },
    { name: "Mixed Fruit Shake", category: "Drinks", sub_category: "Fruit Shakes", price: 150, diet: "veg", description: "Assorted fruit shake" },

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

    // Citrus Juices
    { name: "Orange Juice", category: "Drinks", sub_category: "Citrus Juices", price: 100, diet: "veg", description: "Fresh orange juice" },
    { name: "Sweet Lime Juice", category: "Drinks", sub_category: "Citrus Juices", price: 90, diet: "veg", description: "Sweet lime juice" },
    { name: "Lemon Juice", category: "Drinks", sub_category: "Citrus Juices", price: 70, diet: "veg", description: "Fresh lemon juice" },

    // Fruit Juices
    { name: "Apple Juice", category: "Drinks", sub_category: "Fruit Juices", price: 110, diet: "veg", description: "Fresh apple juice" },
    { name: "Pineapple Juice", category: "Drinks", sub_category: "Fruit Juices", price: 120, diet: "veg", description: "Tropical pineapple juice" },
    { name: "Watermelon Juice", category: "Drinks", sub_category: "Fruit Juices", price: 100, diet: "veg", description: "Refreshing watermelon juice" },

    // Mixed Juices
    { name: "Mixed Fruit Juice", category: "Drinks", sub_category: "Mixed Juices", price: 130, diet: "veg", description: "Assorted fruit juice" },
    { name: "Detox Juice", category: "Drinks", sub_category: "Mixed Juices", price: 150, diet: "veg", description: "Healthy detox blend" },

    // Indian Drinks
    { name: "Buttermilk (Chaas)", category: "Drinks", sub_category: "Indian Drinks", price: 60, diet: "veg", description: "Traditional buttermilk" },
    { name: "Sweet Lassi", category: "Drinks", sub_category: "Indian Drinks", price: 80, diet: "veg", description: "Sweet yogurt drink" },
    { name: "Salted Lassi", category: "Drinks", sub_category: "Indian Drinks", price: 80, diet: "veg", description: "Salted yogurt drink" },

    // Healthy Drinks
    { name: "Coconut Water", category: "Drinks", sub_category: "Healthy Drinks", price: 70, diet: "veg", description: "Fresh coconut water" },
    { name: "Fruit Smoothie", category: "Drinks", sub_category: "Healthy Drinks", price: 140, diet: "veg", description: "Blended fruit smoothie" },
    { name: "Green Smoothie", category: "Drinks", sub_category: "Healthy Drinks", price: 160, diet: "veg", description: "Healthy green smoothie" },

    // Carbonated
    { name: "Coke", category: "Drinks", sub_category: "Carbonated", price: 50, diet: "veg", description: "Coca-Cola" },
    { name: "Pepsi", category: "Drinks", sub_category: "Carbonated", price: 50, diet: "veg", description: "Pepsi Cola" },
    { name: "Sprite", category: "Drinks", sub_category: "Carbonated", price: 50, diet: "veg", description: "Lemon-lime soda" },
    { name: "Fanta", category: "Drinks", sub_category: "Carbonated", price: 50, diet: "veg", description: "Orange soda" },

    // Energy Drinks
    { name: "Red Bull", category: "Drinks", sub_category: "Energy Drinks", price: 120, diet: "veg", description: "Energy drink" },
    { name: "Monster", category: "Drinks", sub_category: "Energy Drinks", price: 130, diet: "veg", description: "Monster energy" },
    { name: "Sting", category: "Drinks", sub_category: "Energy Drinks", price: 60, diet: "veg", description: "Sting energy drink" }
];

const allItems = [...starterItems, ...mainItems, ...dessertItems, ...drinkItems];

console.log(`Starters: ${starterItems.length}`);
console.log(`Main: ${mainItems.length}`);
console.log(`Desserts: ${dessertItems.length}`);
console.log(`Drinks: ${drinkItems.length}`);
console.log(`Total: ${allItems.length}`);

const seed = async () => {
    db.query("DELETE FROM menu", (err) => {
        if (err) {
            console.error("Error clearing menu:", err);
            process.exit(1);
        }

        const sql = "INSERT INTO menu (name, category, sub_category, price, description, diet, image_url, variants) VALUES ?";
        const values = allItems.map(i => [
            i.name,
            i.category,
            i.sub_category,
            i.price,
            i.description || i.name, // Fallback description
            i.diet || "veg",
            i.image_url || null,
            i.variants ? JSON.stringify(i.variants) : null
        ]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error seeding full restoration:", err);
            } else {
                console.log(`✅ ULTIMATE V2 RESTORATION COMPLETE: ${result.affectedRows} items added.`);
                console.log("Categories:", [...new Set(allItems.map(i => i.category))]);
                console.log("Drinks Count:", drinkItems.length);
            }
            process.exit();
        });
    });
};

seed();
