const db = require('./config/db');

// --- TRANSLATION DICTIONARY ---
const translationDictionary = {
    "Starters": { hi: "स्टार्टर्स", mr: "स्टार्टर्स" },
    "Main Menu": { hi: "मुख्य भोजन", mr: "मुख्य मेनू" },
    "Desserts": { hi: "मिठाई", mr: "मिठाई" },
    "Drinks": { hi: "पेय", mr: "पेय" },
    "Veg Starters": { hi: "शाकाहारी शुरुआत", mr: "व्हे़ज स्टार्टर्स" },
    "Non-Veg Starters": { hi: "मांसाहारी शुरुआत", mr: "नॉन-व्हे़ज स्टार्टर्स" },
    "Indian Starters": { hi: "भारतीय शुरुआत", mr: "इंडियन स्टार्टर्स" },
    "Chinese Starters": { hi: "चीनी शुरुआत", mr: "चायनीज स्टार्टर्स" },
    "Tandoor Starters": { hi: "तंदूर शुरुआत", mr: "तंदूर स्टार्टर्स" },
    "Continental Starters": { hi: "कांटिनेंटल शुरुआत", mr: "कांटिनेंटल स्टार्टर्स" },
    "Indian": { hi: "भारतीय", mr: "भारतीय" },
    "North Indian": { hi: "उत्तर भारतीय", mr: "उत्तर भारतीय" },
    "South Indian": { hi: "दक्षिण भारतीय", mr: "दक्षिण भारतीय" },
    "Chinese": { hi: "चीनी", mr: "चायनीज" },
    "Mexican": { hi: "मैक्सिकन", mr: "मेक्सिकन" },
    "Arabic": { hi: "अरबी", mr: "अरबी" },
    "Cakes": { hi: "केक", mr: "केक" },
    "Brownies": { hi: "ब्राउनी", mr: "ब्राउनी" },
    "Ice Cream": { hi: "आइसक्रीम", mr: "आईस्क्रीम" },
    "Icecream": { hi: "आइसक्रीम", mr: "आईस्क्रीम" },
    "Traditional": { hi: "पारंपरिक पेय", mr: "पारंपारिक पेय" },
    "Soft Drinks": { hi: "कोल्ड ड्रिंक्स", mr: "कोल्ड ड्रिंक्स" },
    "Veg": { hi: "शाकाहारी", mr: "व्हे़ज" },
    "Non-Veg": { hi: "मांसाहारी", mr: "नॉन-व्हेज" },
    "Chicken": { hi: "चिकन", mr: "चिकन" },
    "Mutton": { hi: "मटन", mr: "मटन" },
    "Fish": { hi: "मछली", mr: "फिश" },
    "Paneer": { hi: "पनीर", mr: "पनीर" },
    "Rice": { hi: "चावल", mr: "भात" },
    "Biryani": { hi: "बिरयानी", mr: "बिर्याणी" },
    "Noodles": { hi: "नूडल्स", mr: "नूडल्स" },
    "Pasta": { hi: "पास्ता", mr: "पास्ता" },
    "Pizza": { hi: "पिज़्ज़ा", mr: "पिझ्झा" },
    "Burger": { hi: "बर्गर", mr: "बर्गर" },
    "Sandwich": { hi: "सैंडविच", mr: "सँडविच" },
    "Fries": { hi: "फ्राइज़", mr: "फ्राइज" },
    "Soup": { hi: "सूप", mr: "सूप" },
    "Salad": { hi: "सलाद", mr: "कोशिंबीर" },
    "Roti": { hi: "रोटी", mr: "पोळी" },
    "Naan": { hi: "नान", mr: "नान" },
    "Dal": { hi: "दाल", mr: "डाळ" },
    "Tikka": { hi: "टिक्का", mr: "टिक्का" },
    "Masala": { hi: "मसाला", mr: "मसाला" },
    "Kebab": { hi: "कबाब", mr: "कबाब" },
    "Fry": { hi: "फ्राई", mr: "फ्राय" },
    "Curry": { hi: "करी", mr: "करी" },
    "Butter": { hi: "बटर", mr: "बटर" },
    "Chilli": { hi: "चिली", mr: "चिली" },
    "Manchurian": { hi: "मंचूरियन", mr: "मंचूरियन" },
    "Schezwan": { hi: "शेजवान", mr: "शेजवान" },
    "Hakka": { hi: "हक्का", mr: "हक्का" },
    "Fried": { hi: "फ्राइड", mr: "फ्राय" },
    "Tandoori": { hi: "तंदूरी", mr: "तंदूरी" },
    "Rolls": { hi: "रोल्स", mr: "रोल्स" },
    "Spring": { hi: "स्प्रिंग", mr: "स्प्रिंग" },
    "Garlic": { hi: "लहसुन", mr: "लसूण" },
    "Cheese": { hi: "चीज़", mr: "चीज" },
    "Corn": { hi: "कॉर्न", mr: "कॉर्न" },
    "Mushroom": { hi: "मशरूम", mr: "मशरूम" },
    "Chocolate": { hi: "चॉकलेट", mr: "चॉकलेट" },
    "Vanilla": { hi: "वनीला", mr: "व्हॅनिला" },
    "Strawberry": { hi: "स्ट्रॉबेरी", mr: "स्ट्रॉबेरी" },
    "Tea": { hi: "चाय", mr: "चहा" },
    "Coffee": { hi: "कॉफी", mr: "कॉफी" },
    "Shake": { hi: "शेक", mr: "शेक" },
    "Juice": { hi: "रस", mr: "ज्यूस" },
    "Lassi": { hi: "लस्सी", mr: "लस्सी" },
    "Coke": { hi: "कोक", mr: "कोक" },
    "Pepsi": { hi: "पेप्सी", mr: "पेप्सी" },
    "Sprite": { hi: "स्प्राइट", mr: "स्प्राइट" }
};

const sortedKeys = Object.keys(translationDictionary).sort((a, b) => b.length - a.length);

const translate = (text, lang) => {
    if (!text) return text;
    let translated = text.trim();
    sortedKeys.forEach(engWord => {
        const regex = new RegExp(`\\b${engWord}\\b`, 'gi');
        if (regex.test(translated)) {
            translated = translated.replace(regex, translationDictionary[engWord][lang]);
        }
    });
    return translated.replace(/\s+/g, ' ').trim();
};

// --- DATASET ---
const starters = [
    { name: "Veg Spring Rolls", category: "Starters", sub_category: "Veg Starters", price: 180, image_url: "/images/veg_spring_rolls.png" },
    { name: "Paneer Tikka", category: "Starters", sub_category: "Veg Starters", price: 240, image_url: "/images/paneer_tikka.png" },
    { name: "Veg Manchurian", category: "Starters", sub_category: "Veg Starters", price: 190, image_url: "/images/veg_manchurian.png" },
    { name: "Crispy Corn", category: "Starters", sub_category: "Veg Starters", price: 170, image_url: "/images/crispy_corn.png" },
    { name: "Hara Bhara Kebab", category: "Starters", sub_category: "Veg Starters", price: 210, image_url: "/images/hara_bhara.png" },
    { name: "Cheese Balls", category: "Starters", sub_category: "Veg Starters", price: 200, image_url: "/images/cheese_balls.png" },
    { name: "Chicken Tikka", category: "Starters", sub_category: "Non-Veg Starters", price: 280, image_url: "/images/chicken_tikka.png" },
    { name: "Chicken 65", category: "Starters", sub_category: "Non-Veg Starters", price: 260, image_url: "/images/chicken_65.png" },
    { name: "Chicken Lollipop", category: "Starters", sub_category: "Non-Veg Starters", price: 270, image_url: "/images/chicken_lollipop.png" },
    { name: "Fish Fingers", category: "Starters", sub_category: "Non-Veg Starters", price: 320, image_url: "/images/fish_fingers.png" },
    { name: "Paneer Pakoda", category: "Starters", sub_category: "Indian Starters", price: 160, image_url: "/images/paneer_pakoda.png" },
    { name: "Aloo Tikki", category: "Starters", sub_category: "Indian Starters", price: 120, image_url: "/images/aloo_tikki.png" },
    { name: "Samosa", category: "Starters", sub_category: "Indian Starters", price: 90, image_url: "/images/samosa.png" },
    { name: "Chilli Paneer", category: "Starters", sub_category: "Chinese Starters", price: 230, image_url: "/images/chilli_paneer.png" },
    { name: "Chilli Chicken", category: "Starters", sub_category: "Chinese Starters", price: 290, image_url: "/images/chilli_chicken.png" },
    { name: "Chicken Tandoori", category: "Starters", sub_category: "Tandoor Starters", price: 340, image_url: "/images/chicken_tandoori.png" },
    { name: "Garlic Bread", category: "Starters", sub_category: "Continental Starters", price: 150, image_url: "/images/garlic_bread.png" },
    { name: "French Fries", category: "Starters", sub_category: "Continental Starters", price: 120, image_url: "/images/fries.png" }
];

const mains = [
    { name: "Paneer Butter Masala", category: "Main Menu", sub_category: "Indian", price: 280, diet: "veg", description: "Rich tomato gravy with paneer" },
    { name: "Dal Makhani", category: "Main Menu", sub_category: "Indian", price: 220, diet: "veg", description: "Creamy black lentils" },
    { name: "Chicken Biryani", category: "Main Menu", sub_category: "Indian", price: 320, diet: "non-veg", description: "Fragrant basmati rice with chicken" },
    { name: "Butter Chicken", category: "Main Menu", sub_category: "North Indian", price: 350, diet: "non-veg", description: "Classic chicken in butter sauce" },
    { name: "Chole Bhature", category: "Main Menu", sub_category: "North Indian", price: 180, diet: "veg", description: "Chickpea curry with fried bread" },
    { name: "Veg Hakka Noodles", category: "Main Menu", sub_category: "Chinese", price: 220, diet: "veg", description: "Wok-tossed noodles" },
    { name: "Schezwan Fried Rice", category: "Main Menu", sub_category: "Chinese", price: 240, diet: "veg", description: "Spicy fried rice" },
    { name: "Veg Alfredo Pasta", category: "Continental", sub_category: "Pasta & Rice", price: 320, diet: "veg", description: "Pasta in creamy white sauce" },
    { name: "Paneer Tikka Pizza", category: "Fusion", sub_category: "Indian Fusion", price: 350, diet: "veg", description: "Indian flavored deep-pan pizza" }
];

const desserts = [
    { name: "Chocolate Cake", category: "Desserts", sub_category: "Cakes", price: 450, image_url: "/images/chocolate_cake.png" },
    { name: "Red Velvet Cake", category: "Desserts", sub_category: "Cakes", price: 520, image_url: "/images/red_velvet.png" },
    { name: "Chocolate Brownie", category: "Desserts", sub_category: "Brownies", price: 120, image_url: "/images/brownie.png" },
    { name: "Vanilla Ice Cream", category: "Desserts", sub_category: "Ice Creams", price: 80, image_url: "/images/vanilla_ic.png" },
    { name: "Gulab Jamun", category: "Desserts", sub_category: "Indian Sweets", price: 100, image_url: "/images/gulab_jamun.png" },
    { name: "Cold Coffee", category: "Desserts", sub_category: "Cold Coffee", price: 140, image_url: "/images/cold_coffee.png" }
];

const drinks = [
    { name: "Masala Tea", category: "Drinks", sub_category: "Flavored Tea", price: 60, description: "Spiced Indian tea" },
    { name: "Cappuccino", category: "Drinks", sub_category: "Milk Coffee", price: 120, description: "Espresso with steamed milk" },
    { name: "Virgin Mojito", category: "Drinks", sub_category: "Citrus Mocktails", price: 150, description: "Mint and lime mocktail" },
    { name: "Orange Juice", category: "Drinks", sub_category: "Citrus Juices", price: 100, description: "Fresh orange juice" },
    { name: "Sweet Lassi", category: "Drinks", sub_category: "Indian Drinks", price: 80, description: "Sweet yogurt drink" },
    { name: "Coke", category: "Drinks", sub_category: "Carbonated", price: 50, description: "Coca-Cola" }
];

const allItems = [...starters, ...mains, ...desserts, ...drinks];

const seed = async () => {
    console.log("🚀 Starting ULTIMATE PRODUCTION RESTORATION...");

    db.query("DELETE FROM menu_items", (err) => {
        if (err) { console.error(err); process.exit(1); }

        const sql = `INSERT INTO menu_items 
            (name, display_name, description, display_description, price, category, display_category, sub_category, display_sub_category, diet, image_url) 
            VALUES ?`;

        const values = allItems.map(i => {
            const mrName = translate(i.name, 'mr');
            const mrCat = translate(i.category, 'mr');
            const mrSub = translate(i.sub_category, 'mr');
            const mrDesc = translate(i.description || i.name, 'mr');

            return [
                i.name,
                mrName,
                i.description || i.name,
                mrDesc,
                i.price,
                i.category,
                mrCat,
                i.sub_category,
                mrSub,
                i.diet || "veg",
                i.image_url || null
            ];
        });

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("❌ Restoration Error:", err);
            } else {
                console.log(`✅ SUCCESS! Restored ${result.affectedRows} original items with Marathi translations.`);
            }
            process.exit();
        });
    });
};

seed();
