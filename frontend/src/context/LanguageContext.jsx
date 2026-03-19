import React, { createContext, useState, useEffect, useContext } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('appLanguage') || 'en');

    useEffect(() => {
        localStorage.setItem('appLanguage', language);
    }, [language]);

    const t = (key) => {
        return translations[language]?.[key] || translations['en'][key] || key;
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
