import React, { useState, useRef, useEffect } from 'react';
import './Header.scss';
import LogoGame from '../../assets/image/logo/gameLogo.png';
import { useLanguage } from '../../context/LanguageContext';
import { LANGUAGES } from '../../constants/translations';
import { SECTIONS } from '../../constants/links';

const Header = () => {
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t, scrollToSection } = useLanguage();
  const langRef = useRef(null);
  const menuRef = useRef(null);

  // Закрытие выпадающего списка при клике вне его
  useEffect(() => {
    const handleClickOutsideLang = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    };

    if (langOpen) {
      document.addEventListener('mousedown', handleClickOutsideLang);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideLang);
    };
  }, [langOpen]);

  const toggleLang = () => {
    setLangOpen(!langOpen);
  };

  const selectLang = (selectedLang) => {
    setLanguage(selectedLang);
    setLangOpen(false);
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
    setMenuOpen(false); // Закрываем меню после клика
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          !event.target.closest('.header__burger')) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutsideMenu);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu);
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__logo">
          <img 
            src={LogoGame} 
            alt="Game Logo"
            className="header__logo-image"
          />
        </div>
        
        {/* Бургер-меню для мобильной версии */}
        <button 
          className="header__burger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? 'header__burger-line header__burger-line--active' : 'header__burger-line'}></span>
          <span className={menuOpen ? 'header__burger-line header__burger-line--active' : 'header__burger-line'}></span>
          <span className={menuOpen ? 'header__burger-line header__burger-line--active' : 'header__burger-line'}></span>
        </button>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} ref={menuRef}>
          <li><a href={`#${SECTIONS.HOME}`} onClick={(e) => handleNavClick(e, SECTIONS.HOME)}>{t('home')}</a></li>
          <li><a href={`#${SECTIONS.ABOUT_GAME}`} onClick={(e) => handleNavClick(e, SECTIONS.ABOUT_GAME)}>{t('aboutGame')}</a></li>
          <li><a href={`#${SECTIONS.GALLERY}`} onClick={(e) => handleNavClick(e, SECTIONS.GALLERY)}>{t('gallery')}</a></li>
          <li><a href={`#${SECTIONS.CONTACT}`} onClick={(e) => handleNavClick(e, SECTIONS.CONTACT)}>{t('contact')}</a></li>
          <li><a href={`#${SECTIONS.TRAILER}`} onClick={(e) => handleNavClick(e, SECTIONS.TRAILER)}>{t('trailer')}</a></li>
        </nav>

        <div className="header__buttons">
          <div className="header__lang" ref={langRef}>
            <button
              className="header__button header__button--lang"
              onClick={toggleLang}
              aria-label="Select language"
              aria-expanded={langOpen}
            >
              {language}
            </button>
            
            {langOpen && (
              <ul className="header__lang-list">
                {LANGUAGES.map((langItem) => (
                  <li 
                    key={langItem.code}
                    onClick={() => selectLang(langItem.code)}
                    className={language === langItem.code ? 'active' : ''}
                  >
                    {langItem.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;