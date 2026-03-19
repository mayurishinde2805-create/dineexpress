const db = require('./config/db');

// Consolidated Dictionary for all matching
const translationDictionary = {
    // Categories & Phrases
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

    // User-Requested Specific Translations (Priority)
    "Orio Milkshake": { hi: "ओरियो मिल्कशेक", mr: "ओरियो मिल्कशेक" },
    "Oreo Milkshake": { hi: "ओरियो मिल्कशेक", mr: "ओरियो मिल्कशेक" },
    "Oreo Shake": { hi: "ओरियो शेक", mr: "ओरियो मिल्कशेक" },
    "Rasmalai": { hi: "रसमलाई", mr: "रसमलाई" },
    "Plate": { hi: "प्लेट", mr: "प्लेट" },
    "mixed fruite punch": { hi: "मिश्र फळ पंच", mr: "मिश्र फळ पंच" },
    "Mixed Fruit Punch": { hi: "मिश्र फळ पंच", mr: "मिश्र फळ पंच" },
    "Malai": { hi: "मलाई", mr: "मलाई" },
    "Breaded fish strips": { hi: "ब्रेडेड फिश स्ट्रिप्स", mr: "ब्रेडेड फिश स्ट्रिप्स" },
    "Fish Fingers": { hi: "फिश फिंगर्स", mr: "ब्रेडेड फिश स्ट्रिप्स" },
    "Fried chicken winglets": { hi: "फ्राय चिकन विंगलेट", mr: "फ्राय चिकन विंगलेट" },
    "Chicken Wings": { hi: "चिकन विंग्स", mr: "फ्राय चिकन विंगलेट" },
    "Fried cheese balls": { hi: "फ्राय चीज बॉल्स", mr: "फ्राय चीज बॉल्स" },
    "Onion fritters": { hi: "कांद्याची भाजी", mr: "कांद्याची भाजी" },
    "Onion Bhaji": { hi: "कांदा भजी", mr: "कांद्याची भाजी" },
    "Yogurt patties": { hi: "दही पॅटीस", mr: "दही पॅटीस" },
    "Minced meat kebab": { hi: "किसलेले मांस कबाब", mr: "किसलेले मांस कबाब" },
    "Classic salted fries": { hi: "क्लासिक सॉल्टेड फ्राईज", mr: "क्लासिक सॉल्टेड फ्राईज" },
    "French Fries": { hi: "फ्रेंच फ्राइज", mr: "क्लासिक सॉल्टेड फ्राईज" },
    "Starter": { hi: "स्टार्टर्स", mr: "स्टार्टर्स" },
    "starters": { hi: "स्टार्टर्स", mr: "स्टार्टर्स" },
    "Kashmiri mutton curry": { hi: "काश्मिरी मटण करी", mr: "काश्मिरी मटण करी" },
    "Mutton Rogan Josh": { hi: "मटन रोगन जोश", mr: "काश्मिरी मटण करी" },
    "Indo-chinese classic": { hi: "इंडो-चायनीज क्लासिक", mr: "इंडो-चायनीज क्लासिक" },
    "Chicken Manchurian": { hi: "चिकन मंचूरियन", mr: "इंडो-चायनीज क्लासिक" },
    "Bread": { hi: "ब्रेड", mr: "ब्रेड" },
    "Watermelon": { hi: "तरबूज", mr: "कलिंगड" },

    // Words/Ingredients
    "Veg": { hi: "शाकाहारी", mr: "व्हे़ज" },
    "Non-Veg": { hi: "मांसाहारी", mr: "नॉन-व्हेज" },
    "Chicken": { hi: "चिकन", mr: "चिकन" },
    "Mutton": { hi: "मटन", mr: "मटन" },
    "Fish": { hi: "मछली", mr: "फिश" },
    "Prawns": { hi: "झींगा", mr: "कोलंबी" },
    "Egg": { hi: "अंडा", mr: "अंडा" },
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
    "Momos": { hi: "मोमोस", mr: "मोमोज" },
    "Sizzler": { hi: "सिज़लर", mr: "सिझलर" },
    "Platter": { hi: "थाली", mr: "प्लॅटर" },
    "Combo": { hi: "कॉम्बो", mr: "कॉम्बो" },
    "Special": { hi: "स्पेशल", mr: "स्पेशल" },
    "Delight": { hi: "डिलाइट", mr: "डिलाईट" },
    "Supreme": { hi: "सुप्रीम", mr: "सुप्रीम" },
    "Classic": { hi: "क्लासिक", mr: "क्लासिक" },
    "Hot": { hi: "हॉट", mr: "हॉट" },
    "Cold": { hi: "कोल्ड", mr: "कोल्ड" },
    "Grill": { hi: "ग्रिल", mr: "ग्रिल" },
    "Roast": { hi: "रोस्ट", mr: "रोस्ट" },
    "Mojito": { hi: "मोजिटो", mr: "मोजिटो" },
    "Latte": { hi: "लाते", mr: "लाते" },
    "Cappuccino": { hi: "कैपुचीनो", mr: "कॅपचिनो" },
    "Espresso": { hi: "एस्प्रेसो", mr: "एस्प्रेसो" },
    "Americano": { hi: "अमेरिकनो", mr: "अमेरिकनो" },
    "Macchiato": { hi: "मैकियाटो", mr: "मॅकचीटो" },
    "Frappe": { hi: "फ्रैप्पे", mr: "फ्रॅपे" },
    "Smoothie": { hi: "स्मूदी", mr: "स्मूदी" },
    "Soda": { hi: "सोडा", mr: "सोडा" },
    "Water": { hi: "पानी", mr: "पाणी" },
    "Syrup": { hi: "सिरप", mr: "सिरप" },
    "Lime": { hi: "नींबू", mr: "लिंबू" },
    "Mint": { hi: "पुदीना", mr: "पुदीना" },
    "Orange": { hi: "संतरा", mr: "संत्र" },
    "Apple": { hi: "सेब", mr: "सफरचंद" },
    "Mango": { hi: "आम", mr: "आंबा" },
    "Pineapple": { hi: "अनानास", mr: "अननस" },
    "Caramel": { hi: "कारमेल", mr: "कॅरमेल" },
    "Hazelnut": { hi: "हेज़लनट", mr: "हेझलनट" },
    "Berry": { hi: "बेरी", mr: "बेरी" },
    "Peach": { hi: "आड़ू", mr: "पीच" },
    "Lemon": { hi: "नींबू", mr: "लिंबू" },
    "Ginger": { hi: "अदरक", mr: "आले" },
    "Honey": { hi: "शहद", mr: "मध" },
    "Sugar": { hi: "चीनी", mr: "साखर" },
    "Milk": { hi: "दूध", mr: "दूध" },
    "Cream": { hi: "मलाई", mr: "मलाई" },
    "Yogurt": { hi: "दही", mr: "दही" },
    "Buttermilk": { hi: "छाछ", mr: "ताक" },
    "Iced": { hi: "बर्फीली", mr: "आईस्ड" },
    "Black": { hi: "काली", mr: "ब्लॅक" },
    "Green": { hi: "हरी", mr: "ग्रीन" },
    "Herbal": { hi: "हर्बल", mr: "हर्बल" },
    "Regular": { hi: "रेगुलर", mr: "रेग्युलर" },
    "Strong": { hi: "कड़क", mr: "कडक" },
    "Small": { hi: "छोटा", mr: "लहाण" },
    "Medium": { hi: "मध्यम", mr: "मध्यम" },
    "Large": { hi: "बड़ा", mr: "मोठा" },
    "Thick": { hi: "गाढ़ा", mr: "जाड" },
    "Punch": { hi: "पंच", mr: "पंच" },
    "Sweet": { hi: "मीठा", mr: "गोड" },
    "Salted": { hi: "नमकीन", mr: "खारट" },
    "Coconut": { hi: "नारियल", mr: "नारळ" },
    "Seekh": { hi: "सीख", mr: "सीख" },
    "Bread": { hi: "ब्रेड", mr: "ब्रेड" },
    "Toast": { hi: "टोस्ट", mr: "टोस्ट" },
    "double": { hi: "डबल", mr: "डबल" },
    "scoop": { hi: "स्कूप", mr: "स्कूप" },
    "Double": { hi: "डबल", mr: "डबल" },
    "Scoop": { hi: "स्कूप", mr: "स्कूप" },
    "Classic": { hi: "क्लासिक", mr: "क्लासिक" },
    "Signature": { hi: "सिग्नेचर", mr: "सिग्नेचर" },
    "Premium": { hi: "प्रीमियम", mr: "प्रीमियम" },
    "Fresh": { hi: "ताज़ा", mr: "ताजे" },
    "Hara Bhara": { hi: "हरा भरा", mr: "हरा भरा" },
    "Hara": { hi: "हरा", mr: "हरा" },
    "Bhara": { hi: "भरा", mr: "भरा" },
    "Aloo Tikki": { hi: "आलू टिक्की", mr: "बटाटा टिक्की" },
    "Aloo": { hi: "आलू", mr: "बटाटा" },
    "Tikki": { hi: "टिक्की", mr: "टिक्की" },
    "Dahi Kebab": { hi: "दही कबाब", mr: "दही कबाब" },
    "Dahi": { hi: "दही", mr: "दही" },
    "Samosa": { hi: "समोसा", mr: "समोसा" },
    "Crispy": { hi: "क्रिस्पी", mr: "क्रिस्पी" },
    "Baby": { hi: "बेबी", mr: "बेबी" },
    "Quesadilla": { hi: "क्वासाडिला", mr: "क्वासाडिला" },
    "Tacos": { hi: "टकोस", mr: "टाकोस" },
    "Burrito": { hi: "बरिटो", mr: "बुरिटो" },
    "Shawarma": { hi: "शवरमा", mr: "शवरमा" },
    "Falafel": { hi: "फलाफेल", mr: "फलाफेल" },
    "Hummus": { hi: "हम्मस", mr: "हम्मस" },
    "Wrap": { hi: "रैप", mr: "रॅप" },
    "Grilled": { hi: "ग्रिल्ड", mr: "ग्रिल्ड" },
    "Herb": { hi: "हर्ब", mr: "हर्ब" },
    "Alfredo": { hi: "अल्फ्रेडो", mr: "अल्फ्रेडो" },
    "Carbonara": { hi: "कार्बोनारा", mr: "कार्बोनारा" },
    "Risotto": { hi: "रिसोट्टो", mr: "रिसोट्टो" },
    "Thai": { hi: "थाई", mr: "थाई" },
    "Wedges": { hi: "वेजेस", mr: "वेजेस" },
    "Nachos": { hi: "नाचोस", mr: "नाचोस" },
    "Chips": { hi: "चिप्स", mr: "चिप्स" },
    "Dessert": { hi: "मिठाई", mr: "मिठाई" },
    "Combo": { hi: "कॉम्बो", mr: "कॉम्बो" },
    "KitKat": { hi: "किटकेट", mr: "किटकेट" },
    "Virgin": { hi: "वर्जिन", mr: "वर्जिन" },
    "Splash": { hi: "स्प्लैश", mr: "स्प्लैश" },
    "Cooler": { hi: "कूलर", mr: "कूलर" },
    "Punch": { hi: "पंच", mr: "पंच" },
    "Mixed Fruit": { hi: "मिश्रित फल", mr: "मिश्र फळ" },
    "Mixed": { hi: "मिश्रित", mr: "मिश्र" },
    "Fruit": { hi: "फल", mr: "फळ" },
    "Black Forest": { hi: "ब्लैक फॉरेस्ट", mr: "ब्लॅक फॉरेस्ट" },
    "Forest": { hi: "फॉरेस्ट", mr: "फॉरेस्ट" },
    "Blue Lagoon": { hi: "ब्लू लगून", mr: "ब्लू लगून" },
    "Lagoon": { hi: "लगून", mr: "लगून" },
    "Red Velvet": { hi: "रेड वेलवेट", mr: "रेड वेलवेट" },
    "Red": { hi: "लाल", mr: "लाल" },
    "Velvet": { hi: "वेलवेट", mr: "वेलवेट" },
    "Walnut": { hi: "अखरोट", mr: "अक्रोड" },
    "Gulab Jamun": { hi: "गुलाब जामुन", mr: "गुलाब जामुन" },
    "Gulab": { hi: "गुलाब", mr: "गुलाब" },
    "Jamun": { hi: "जामुन", mr: "जामुन" },
    "Rasgulla": { hi: "रसगुल्ला", mr: "रसगुल्ला" },
    "Ras Malai": { hi: "रसमलाई", mr: "रसमलाई" },
    "Ras": { hi: "रस", mr: "रस" },
    "Jalebi": { hi: "जलेबी", mr: "जलेबी" },
    "Chaas": { hi: "छाछ", mr: "ताक" },
    "Coke": { hi: "कोक", mr: "कोक" },
    "Pepsi": { hi: "पेप्सी", mr: "पेप्सी" },
    "Sprite": { hi: "स्प्राइट", mr: "स्प्राइट" },
    "Red Bull": { hi: "रेड बुल", mr: "रेड बुल" },
    "Sting": { hi: "स्टिंग", mr: "स्टिंग" },
    "with": { hi: "के साथ", mr: "सह" },
    "and": { hi: "और", mr: "आणि" },
    "Potato": { hi: "आलू", mr: "बटाटा" },
    "Lollipop": { hi: "लॉलीपॉप", mr: "लॉलीपॉप" },
    "Balls": { hi: "बॉल्स", mr: "बॉल्स" },
    "Cake": { hi: "केक", mr: "केक" },
    "Pakoda": { hi: "पकोड़ा", mr: "भजी" },
    "Brownie": { hi: "ब्राउनी", mr: "ब्राउनी" },
    "Roll": { hi: "रोल", mr: "रोल" },
    "Makhani": { hi: "मखनी", mr: "मखनी" },
    "Palak": { hi: "पालक", mr: "पालक" },
    "Kadhai": { hi: "कढ़ाई", mr: "कढाई" },
    "Handi": { hi: "हा़ंडी", mr: "हा़ंडी" },
    "Tawa": { hi: "तवा", mr: "तवा" },
    "Dum": { hi: "दम", mr: "दम" },
    "Jeera": { hi: "जीरा", mr: "जिरे" },
    "Chole": { hi: "छोले", mr: "छोले" },
    "Bhature": { hi: "भटूरे", mr: "भटूरे" },
    "Gravy": { hi: "ग्रेवी", mr: "ग्रेवी" },
    "Dry": { hi: "ड्राई", mr: "ड्राय" }
};

// Sort dictionary by key length descending to match longest phrases first
const sortedKeys = Object.keys(translationDictionary).sort((a, b) => b.length - a.length);

const translateSmart = (text, lang) => {
    if (!text) return text;

    let translated = text.trim();

    // 1. Case-Insensitive Exact Match
    const foundKey = Object.keys(translationDictionary).find(k => k.toLowerCase() === translated.toLowerCase());
    if (foundKey && translationDictionary[foundKey][lang]) {
        return translationDictionary[foundKey][lang];
    }

    // 2. Phrase/Word Substitution (Sorted by Length)
    sortedKeys.forEach(engWord => {
        // Only use word boundaries if the word is not tiny (to avoid issues)
        const regex = new RegExp(`\\b${engWord}\\b`, 'gi');
        if (regex.test(translated)) {
            translated = translated.replace(regex, translationDictionary[engWord][lang]);
        }
    });

    // 3. Final cleanup of any double spaces
    return translated.replace(/\s+/g, ' ').trim();
};

const updateTranslations = async () => {
    console.log("Starting SMART translation update...");
    db.query("SELECT * FROM menu", (err, items) => {
        if (err) { console.error(err); process.exit(1); }

        let completed = 0;
        if (items.length === 0) process.exit();

        items.forEach(item => {
            const name_hi = translateSmart(item.name, 'hi');
            const name_mr = translateSmart(item.name, 'mr');
            // console.log(`Translating [${item.name}] -> HI: [${name_hi}] | MR: [${name_mr}]`);

            const cat_hi = translateSmart(item.category, 'hi');
            const cat_mr = translateSmart(item.category, 'mr');

            const sub_hi = translateSmart(item.sub_category, 'hi');
            const sub_mr = translateSmart(item.sub_category, 'mr');

            // Handle Variants translation
            let variants_hi = null;
            let variants_mr = null;

            if (item.variants) {
                try {
                    let variantsArr = item.variants;
                    if (typeof variantsArr === 'string') {
                        variantsArr = JSON.parse(variantsArr);
                    }

                    if (Array.isArray(variantsArr)) {
                        variants_hi = JSON.stringify(variantsArr.map(v => ({
                            ...v,
                            name: translateSmart(v.name, 'hi')
                        })));
                        variants_mr = JSON.stringify(variantsArr.map(v => ({
                            ...v,
                            name: translateSmart(v.name, 'mr')
                        })));
                    }
                } catch (e) {
                    console.error("Error parsing variants for item", item.id, e.message);
                }
            }

            const sql = `
                UPDATE menu SET 
                name_hi = ?, name_mr = ?, 
                category_hi = ?, category_mr = ?,
                sub_category_hi = ?, sub_category_mr = ?,
                variants_hi = ?, variants_mr = ?
                WHERE id = ?
            `;

            db.query(sql, [name_hi, name_mr, cat_hi, cat_mr, sub_hi, sub_mr, variants_hi, variants_mr, item.id], (err) => {
                completed++;
                if (completed === items.length) {
                    console.log("✅ SMART Translation updates complete.");
                    process.exit();
                }
            });
        });
    });
};

updateTranslations();
