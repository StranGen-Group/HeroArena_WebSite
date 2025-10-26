import React from 'react';
import './HeroSection.scss';
import heroImage from '../../assets/image/phone/iPhoneBg.png';
import googlePlayIcon from '../../assets/image/icons/google-play.svg';
import appStoreIcon from '../../assets/image/icons/app-store.svg';

const HeroSection1 = () => {
  return (
    <section className="hero" id="about-game">
      <div className="hero__background">
        <div className="hero__shape hero__shape--cyan"></div>
      </div>

      <div className="hero__content">
        <div className="hero__image-wrapper">
          <img 
            src={heroImage} 
            alt="Game Screenshot" 
            className="hero__image"
          />
        </div>

        <div className="hero__text-content">
          <h1 className="hero__title">
            Это потрясающая игра
          </h1>
          
          <p className="hero__description">
            В этой игре столько страданий, помогите нам денежкой! 
            Поддержите разработку и станьте частью нашей истории.
          </p>

          <div className="hero__buttons">
            <a 
              href="https://play.google.com/store" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hero__button hero__button--google"
              aria-label="Download on Google Play"
            >
              <div className="hero__button-content">
                <img 
                  src={googlePlayIcon} 
                  alt="Google Play" 
                  className="hero__icon"
                />
              </div>
            </a>

            <a 
              href="https://www.apple.com/app-store/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hero__button hero__button--apple"
              aria-label="Download on App Store"
            >
              <div className="hero__button-content">
                <img 
                  src={appStoreIcon} 
                  alt="App Store" 
                  className="hero__icon"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection1;