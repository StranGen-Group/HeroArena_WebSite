import React, { createContext, useState, useContext } from 'react';
import { TRANSLATIONS, DEFAULT_LANGUAGE } from '../constants/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  const translations = TRANSLATIONS;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  const getCurrentTranslations = () => {
    return translations[language] || translations[DEFAULT_LANGUAGE];
  };

  const value = {
    language,
    setLanguage,
    translations,
    t,
    scrollToSection,
    getCurrentTranslations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

