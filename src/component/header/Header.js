import React, { useState, useRef, useEffect } from 'react';
import './Header.scss';

const Header = () => {
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState('EN');
  const langRef = useRef(null);

  // Закрытие выпадающего списка при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    };

    if (langOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langOpen]);

  const toggleLang = () => {
    setLangOpen(!langOpen);
  };

  const selectLang = (selectedLang) => {
    setLang(selectedLang);
    setLangOpen(false);
  };

  const languages = [
    { code: 'RU', name: 'Русский' },
    { code: 'EN', name: 'English' },
    { code: 'UZ', name: "O'zbekcha" }
  ];

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__logo">LOGO</div>
        
        <nav className="header__nav">
          <li><a href="#home">Home</a></li>
          <li><a href="#about-game">About Game</a></li>
          <li><a href="#our-team">Our Team</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#trailer">Trailer</a></li>
        </nav>

        <div className="header__buttons">
          <div className="header__lang" ref={langRef}>
            <button
              className="header__button header__button--lang"
              onClick={toggleLang}
              aria-label="Select language"
              aria-expanded={langOpen}
            >
              {lang}
            </button>
            
            {langOpen && (
              <ul className="header__lang-list">
                {languages.map((language) => (
                  <li 
                    key={language.code}
                    onClick={() => selectLang(language.code)}
                    className={lang === language.code ? 'active' : ''}
                  >
                    {language.name}
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