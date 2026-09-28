import React, { useState, useRef, useEffect } from 'react';
import './Header.scss';
import ThemeToggle from '../themeToggle/ThemeToggle';
import LogoGame from '../../assets/image/logo/gameLogo.webp';
import { useLanguage } from '../../context/LanguageContext';
import { LANGUAGES } from '../../constants/translations';
import { SECTIONS } from '../../constants/links';
import { track } from '../../utils/analytics';

// Nav follows page order. The roster has no entry of its own: it belongs to Home.
const NAV_ITEMS = [
  { id: SECTIONS.HOME, labelKey: 'home' },
  { id: SECTIONS.GALLERY, labelKey: 'gallery' },
  { id: SECTIONS.TRAILER, labelKey: 'trailer' },
  { id: SECTIONS.STUDIO, labelKey: 'studio' },
  { id: SECTIONS.SOCIALS, labelKey: 'socials' },
];
const SPY_ALIAS = { [SECTIONS.ROSTER]: SECTIONS.HOME };

const Header = () => {
  const [langOpen, setLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS.HOME);
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
    track('language_switch', { to: selectedLang.toLowerCase() });
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

  // Scrollspy: whichever section crosses the middle of the viewport is "current".
  useEffect(() => {
    const ids = [...NAV_ITEMS.map((item) => item.id), SECTIONS.ROSTER];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(SPY_ALIAS[entry.target.id] || entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

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
        <a className="header__logo" href={`#${SECTIONS.HOME}`} aria-label="Hero Arena home" onClick={(e) => handleNavClick(e, SECTIONS.HOME)}>
          <img
            src={LogoGame}
            alt="Hero Arena"
            className="header__logo-image"
            width={180}
            height={191}
          />
        </a>
        
        {/* Бургер-меню для мобильной версии */}
        <button 
          className="header__burger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
        >
          <span className={menuOpen ? 'header__burger-line header__burger-line--active' : 'header__burger-line'}></span>
          <span className={menuOpen ? 'header__burger-line header__burger-line--active' : 'header__burger-line'}></span>
          <span className={menuOpen ? 'header__burger-line header__burger-line--active' : 'header__burger-line'}></span>
        </button>

        <nav id="primary-navigation" aria-label="Primary navigation" className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} ref={menuRef}>
          <ul>
            {NAV_ITEMS.map(({ id, labelKey }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  className={activeSection === id ? 'is-active' : undefined}
                  aria-current={activeSection === id ? 'location' : undefined}
                >
                  {t(labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__buttons">
          <ThemeToggle />
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
              <ul className="header__lang-list" aria-label="Available languages">
                {LANGUAGES.map((langItem) => (
                  <li key={langItem.code}>
                    <button
                      type="button"
                      onClick={() => selectLang(langItem.code)}
                      className={language === langItem.code ? 'active' : ''}
                      aria-current={language === langItem.code ? 'true' : undefined}
                    >
                      {langItem.name}
                    </button>
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
