import React from 'react';
import './HeroSection.scss';
import heroImage from '../../assets/image/phone/iPhoneBg.png';
import googlePlayIcon from '../../assets/image/icons/google-play.svg';
import appStoreIcon from '../../assets/image/icons/app-store.svg';
import { useLanguage } from '../../context/LanguageContext';
import useInView from '../../hooks/useInView';
import { APP_LINKS } from '../../constants/links';
import { SECTIONS } from '../../constants/links';
import { ANIMATION_CONFIG, ANIMATION_CLASSES } from '../../constants/animation';

const HeroSection = () => {
  const { t } = useLanguage();
  const [imageRef, imageInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });
  const [textRef, textInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });
  const [buttonsRef, buttonsInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.MEDIUM });

  return (
    <section className="hero" id={SECTIONS.ABOUT_GAME}>
      <div className="hero__background">
        <div className="hero__shape hero__shape--cyan"></div>
      </div>

      <div className="hero__content">
        <div 
          ref={imageRef}
          className={`hero__image-wrapper ${imageInView ? `${ANIMATION_CLASSES.FADE_IN_LEFT} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
        >
          <img 
            src={heroImage} 
            alt="Game Screenshot" 
            className="hero__image"
          />
        </div>

        <div className="hero__text-content">
          <h1 
            ref={textRef}
            className={`hero__title ${textInView ? `${ANIMATION_CLASSES.FADE_IN_RIGHT} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
            style={{ animationDelay: ANIMATION_CONFIG.DELAY.MEDIUM }}
          >
            {t('heroTitle')}
          </h1>
          
          <p 
            className={`hero__description ${textInView ? `${ANIMATION_CLASSES.FADE_IN_RIGHT} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
            style={{ animationDelay: ANIMATION_CONFIG.DELAY.LONG }}
          >
            {t('heroDescription')}
          </p>

          <div 
            ref={buttonsRef}
            className={`hero__buttons ${buttonsInView ? `${ANIMATION_CLASSES.FADE_IN_UP} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
            style={{ animationDelay: ANIMATION_CONFIG.DELAY.EXTRA_LONG }}
          >
            <a 
              href={APP_LINKS.GOOGLE_PLAY} 
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
              href={APP_LINKS.APP_STORE} 
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

export default HeroSection;