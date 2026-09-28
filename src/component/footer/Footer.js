import React from 'react';
import './Footer.scss';

import LogoStr from '../../assets/image/logo/logo_str.webp';
import { SECTIONS } from '../../constants/links';
import { useLanguage } from '../../context/LanguageContext';

// The community section right above already carries every social link, so the
// footer is just the studio sign-off.
const Footer = () => {
    const { t, scrollToSection } = useLanguage();

    const backToTop = (e) => {
        e.preventDefault();
        scrollToSection(SECTIONS.HOME);
    };

    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__studio">
                    <img
                        src={LogoStr}
                        alt="StranGen Group"
                        className="footer__studio-logo"
                        width={210}
                        height={76}
                    />
                    <span className="footer__studio-copy">{t('footerCopyright')}</span>
                </div>

                <a className="footer__top" href={`#${SECTIONS.HOME}`} onClick={backToTop}>
                    {t('backToTop')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
