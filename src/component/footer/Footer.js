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
import { APP_LINKS } from '../../constants/links';

const Footer = () => {
    const socialLinks = [
        { icon: YouTube, url: APP_LINKS.SOCIAL.YOUTUBE, alt: 'YouTube' },
        { icon: Discord, url: APP_LINKS.SOCIAL.DISCORD, alt: 'Discord' },
        { icon: Instagram, url: APP_LINKS.SOCIAL.INSTAGRAM, alt: 'Instagram' },
        { icon: Telegram, url: APP_LINKS.SOCIAL.TELEGRAM, alt: 'Telegram' },
        { icon: X, url: APP_LINKS.SOCIAL.X, alt: 'X' },
        { icon: Facebook, url: APP_LINKS.SOCIAL.FACEBOOK, alt: 'Facebook' },
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
                        >
                            <img src={link.icon} alt={link.alt} />
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
                    >
                        <div className="footer__button-content">
                            <img
                                src={googlePlayIcon}
                                alt="Google Play"
                                className="footer__icon"
                            />
                        </div>
                    </a>

                    <a
                        href={APP_LINKS.APP_STORE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer__button footer__button--apple"
                        aria-label="Download on App Store"
                    >
                        <div className="footer__button-content">
                            <img
                                src={appStoreIcon}
                                alt="App Store"
                                className="footer__icon"
                            />
                        </div>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;