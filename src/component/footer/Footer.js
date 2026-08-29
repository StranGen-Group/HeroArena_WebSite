import React from 'react';
import './Footer.scss';

import YouTube from '../../assets/image/icons/Social Icons.svg';
import Discord from '../../assets/image/icons/Social Icons-1.svg';
import Instagram from '../../assets/image/icons/Social Icons-2.svg';
import Telegram from '../../assets/image/icons/Social Icons-3.svg';

import googlePlayIcon from '../../assets/image/icons/google-play.svg';
import appStoreIcon from '../../assets/image/icons/app-store.svg';
import X from '../../assets/image/icons/Social Icons-5.svg';
import Facebook from '../../assets/image/icons/Social Icons-4.svg';
import LogoStr from '../../assets/image/logo/logo_str.png';
import { APP_LINKS } from '../../constants/links';
import { track } from '../../utils/analytics';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    const socialLinks = [
        { icon: YouTube, url: APP_LINKS.SOCIAL.YOUTUBE, alt: 'YouTube', size: 30 },
        { icon: Discord, url: APP_LINKS.SOCIAL.DISCORD, alt: 'Discord', size: 30 },
        { icon: Instagram, url: APP_LINKS.SOCIAL.INSTAGRAM, alt: 'Instagram', size: 30 },
        { icon: Telegram, url: APP_LINKS.SOCIAL.TELEGRAM, alt: 'Telegram', size: 30 },
        { icon: X, url: APP_LINKS.SOCIAL.X, alt: 'X', size: 48 },
        { icon: Facebook, url: APP_LINKS.SOCIAL.FACEBOOK, alt: 'Facebook', size: 48 },
    ];

    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__icons">
                    {socialLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => track('social_click', { network: link.alt.toLowerCase() })}
                        >
                            <img src={link.icon} alt={link.alt} width={link.size} height={link.size} />
                        </a>
                    ))}
                </div>

                <div className="footer__buttons">
                    <a
                        href={APP_LINKS.GOOGLE_PLAY}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer__button footer__button--google"
                        aria-label="Download on Google Play"
                        onClick={() => track('cta_click', { target: 'google_play' })}
                    >
                        <div className="footer__button-content">
                            <img
                                src={googlePlayIcon}
                                alt="Google Play"
                                className="footer__icon"
                                width={340}
                                height={100}
                            />
                        </div>
                    </a>

                    <a
                        href={APP_LINKS.APP_STORE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer__button footer__button--apple"
                        aria-label="Download on App Store"
                        onClick={() => track('cta_click', { target: 'app_store' })}
                    >
                        <div className="footer__button-content">
                            <img
                                src={appStoreIcon}
                                alt="App Store"
                                className="footer__icon"
                                width={340}
                                height={100}
                            />
                        </div>
                    </a>
                </div>
            </div>

            <div className="footer__studio">
                <img
                    src={LogoStr}
                    alt=""
                    className="footer__studio-logo"
                    width={2407}
                    height={870}
                />
                <span className="footer__studio-copy">{t('footerCopyright')}</span>
            </div>
        </footer>
    );
};

export default Footer;