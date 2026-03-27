const db = require('./config/db');

// Translation Dictionary (Mocking a real translation service)
// In a real app, this would be comprehensive. Here we map key terms.
const translations = {
    // Categories
    "Starters": { hi: "शुरुआत", mr: "स्टार्टर्स" },
    "Main Menu": { hi: "मुख्य भोजन", mr: "मुख्य मेनू" },
    "Desserts": { hi: "मिठाई", mr: "मिठाई" },
    "Drinks": { hi: "पेय", mr: "पेय" },
    "Continental": { hi: "कांटिनेंटल", mr: "कांटिनेंटल" },
    "Fusion": { hi: "फ्यूजन", mr: "फ्यूजन" },

    // Sub Categories (Common)
    "Veg Starters": { hi: "शाकाहारी शुरुआत", mr: "व्हेज स्टार्टर्स" },
    "Non-Veg Starters": { hi: "मांसाहारी शुरुआत", mr: "नॉन-व्हेज स्टार्टर्स" },
    "Indian Starters": { hi: "भारतीय शुरुआत", mr: "इंडियन स्टार्टर्स" },
    "Chinese Starters": { hi: "चीनी शुरुआत", mr: "चायनीज स्टार्टर्स" },
    "Tandoor Starters": { hi: "तंदूर शुरुआत", mr: "तंदूर स्टार्टर्स" },
    "Continental Starters": { hi: "कांटिनेंटल शुरुआत", mr: "कांटिनेंटल स्टार्टर्स" },
    "Indian": { hi: "भारतीय", mr: "भारतीय" },
    "North Indian": { hi: "उत्तर भारतीय", mr: "उत्तर भारतीय" },
    "Chinese": { hi: "चीनी", mr: "चायनीज" },
    "Mexican": { hi: "मैक्सिकन", mr: "मेक्सिकन" },
    "Arabic": { hi: "अरबी", mr: "अरबी" },
    "Cakes": { hi: "केक", mr: "केक" },
    "Brownies": { hi: "ब्राउनी", mr: "ब्राउनी" },
    "Ice Cream": { hi: "आइसक्रीम", mr: "आईस्क्रीम" },
    "Indian Sweets": { hi: "भारतीय मिठाई", mr: "भारतीय मिठाई" },
    "Classic Tea": { hi: "क्लासिक चाय", mr: "चहा" },

    // Items (Sample)
    "Paneer Tikka": { hi: "पनीर टिक्का", mr: "पनीर टिक्का" },
    "Chicken Biryani": { hi: "चिकन बिरयानी", mr: "चिकन बिर्याणी" },
    "Veg Spring Rolls": { hi: "वेजी स्प्रिंग रोल्स", mr: "व्हेज स्प्रिंग रोल्स" },
    "Butter Chicken": { hi: "बटर चिकन", mr: "बटर चिकन" },
    "Gulab Jamun": { hi: "गुलाब जामुन", mr: "गुलाब जामुन" },
    "Masala Chai": { hi: "मसाला चाय", mr: "मसाला चहा" }
};

// Generic translator
const translate = (text, lang) => {
    if (!text) return null;
    if (translations[text] && translations[text][lang]) return translations[text][lang];
    // Fallback: Transliterate simple logic or keep English if unknown
    // Ideally we would have 100% coverage
    return null;
};

exports.updateTranslations = (callback) => {
    console.log("Starting translation update...");
    db.query("SELECT * FROM menu", (err, items) => {
        if (err) { 
            console.error(err); 
            if (callback) callback(err);
            return;
        }

        let completed = 0;
        if (items.length === 0) {
            if (callback) callback(null);
            return;
        }

        items.forEach(item => {
            const name_hi = translate(item.name, 'hi') || `${item.name} (HI)`;
            const name_mr = translate(item.name, 'mr') || `${item.name} (MR)`;
            const cat_hi = translate(item.category, 'hi') || `${item.category} (HI)`;
            const cat_mr = translate(item.category, 'mr') || `${item.category} (MR)`;
            const sub_hi = translate(item.sub_category, 'hi') || `${item.sub_category} (HI)`;
            const sub_mr = translate(item.sub_category, 'mr') || `${item.sub_category} (MR)`;

            const sql = `UPDATE menu SET 
                name_hi = ?, name_mr = ?, 
                category_hi = ?, category_mr = ?,
                sub_category_hi = ?, sub_category_mr = ?
                WHERE id = ?`;

            db.query(sql, [name_hi, name_mr, cat_hi, cat_mr, sub_hi, sub_mr, item.id], (err) => {
                completed++;
                if (completed === items.length) {
                    console.log("✅ Translation updates complete.");
                    if (callback) callback(null);
                }
            });
        });
    });
};

if (require.main === module) {
    exports.updateTranslations();
}

