import React from 'react';
import './Footer.scss';

import YouTube from '../../assets/image/icons/Social Icons.svg';
import Discord from '../../assets/image/icons/Social Icons-1.svg';
import Instagram from '../../assets/image/icons/Social Icons-2.svg';
import Telegram from '../../assets/image/icons/Social Icons-3.svg';

import googlePlayIcon from '../../assets/image/icons/google-play.svg';
import appStoreIcon from '../../assets/image/icons/app-store.svg';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__icons">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src={Discord} alt="Discord" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src={Instagram} alt="Instagram" />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                        <img src={YouTube} alt="YouTube" />
                    </a>
                    <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
                        <img src={Telegram} alt="Telegram" />
                    </a>
                </div>

                <div className="footer__buttons">
                    <a
                        href="https://play.google.com/store"
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
                        href="https://www.apple.com/app-store/"
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