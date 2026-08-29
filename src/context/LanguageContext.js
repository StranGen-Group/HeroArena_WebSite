import React, { createContext, useState, useContext, useEffect } from 'react';
import { TRANSLATIONS, DEFAULT_LANGUAGE } from '../constants/translations';

const STORAGE_KEY = 'language';

const initialLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && TRANSLATIONS[stored]) return stored;
  } catch (e) {
    // storage blocked — fall through to browser detection
  }
  const browser = (navigator.language || '').slice(0, 2).toUpperCase();
  return TRANSLATIONS[browser] ? browser : DEFAULT_LANGUAGE;
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (e) {
      // storage blocked — the lang attribute is still correct for this session
    }
  }, [language]);

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

