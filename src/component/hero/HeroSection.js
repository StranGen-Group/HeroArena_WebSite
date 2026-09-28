import React from 'react';
import './HeroSection.scss';
import heroImage from '../../assets/image/phone/iPhoneBg.webp';
import discordIcon from '../../assets/image/icons/Social Icons-1.svg';
import telegramIcon from '../../assets/image/icons/Social Icons-3.svg';
import { useLanguage } from '../../context/LanguageContext';
import useInView from '../../hooks/useInView';
import { APP_LINKS, SECTIONS } from '../../constants/links';
import { ANIMATION_CONFIG, ANIMATION_CLASSES } from '../../constants/animation';
import { track } from '../../utils/analytics';

const HeroSection = () => {
  const { t } = useLanguage();
  const [imageRef, imageInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });
  const [textRef, textInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });
  const [buttonsRef, buttonsInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.MEDIUM });

  return (
    <section className="hero" id={SECTIONS.HOME}>
      <div className="hero__background" aria-hidden="true"></div>

      <div className="hero__content">
        <div 
          ref={imageRef}
          className={`hero__image-wrapper ${imageInView ? `${ANIMATION_CLASSES.FADE_IN_LEFT} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
        >
          <img
            src={heroImage}
            alt="Hero Arena game screen displayed on a phone"
            className="hero__image"
            width={929}
            height={580}
          />
          <div
            className={`hero__logo-sweep ${imageInView ? 'hero__logo-sweep--active' : ''}`}
            aria-hidden="true"
          ></div>
        </div>

        <div className="hero__text-content">
          <p className="hero__eyebrow">{t('heroEyebrow')}</p>
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
              href={APP_LINKS.SOCIAL.DISCORD}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__button hero__button--primary"
              onClick={() => track('cta_click', { target: 'discord' })}
            >
              <img src={discordIcon} alt="" className="hero__icon" width={22} height={22} />
              <span>{t('joinDiscord')}</span>
            </a>

            <a 
              href={APP_LINKS.SOCIAL.TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__button hero__button--secondary"
              onClick={() => track('cta_click', { target: 'telegram' })}
            >
              <img src={telegramIcon} alt="" className="hero__icon" width={22} height={22} />
              <span>{t('followTelegram')}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
