import React from 'react';
import './Section.scss';
import heroImage from '../../assets/image/phone/iPhone1.png';
import { useLanguage } from '../../context/LanguageContext';
import useInView from '../../hooks/useInView';
import { ANIMATION_CONFIG, ANIMATION_CLASSES } from '../../constants/animation';
import { SECTIONS } from '../../constants/links';

import YouTube from '../../assets/image/icons/Social Icons.svg';
import Discord from '../../assets/image/icons/Social Icons-1.svg';
import Instagram from '../../assets/image/icons/Social Icons-2.svg';
import Telegram from '../../assets/image/icons/Social Icons-3.svg';
import X from '../../assets/image/icons/Social Icons-5.svg';
import Facebook from '../../assets/image/icons/Social Icons-4.svg';
import { APP_LINKS } from '../../constants/links';

const Section = () => {
  const { t } = useLanguage();
  const [textRef, textInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });
  const [imageRef, imageInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });

  const socialLinks = [
    { icon: YouTube, url: APP_LINKS.SOCIAL.YOUTUBE, alt: 'YouTube' },
    { icon: Discord, url: APP_LINKS.SOCIAL.DISCORD, alt: 'Discord' },
    { icon: Instagram, url: APP_LINKS.SOCIAL.INSTAGRAM, alt: 'Instagram' },
    { icon: Telegram, url: APP_LINKS.SOCIAL.TELEGRAM, alt: 'Telegram' },
    { icon: X, url: APP_LINKS.SOCIAL.X, alt: 'X' },
    { icon: Facebook, url: APP_LINKS.SOCIAL.FACEBOOK, alt: 'Facebook' },
  ];

  return (
    <section className="section" id={SECTIONS.SOCIALS}>
      <div className="section__background">
        <div className="section__shape hero__shape--cyan"></div>
      </div>

      <div className="section__content">
        <div
          ref={textRef}
          className={`section__text-content ${textInView ? `${ANIMATION_CLASSES.FADE_IN_RIGHT} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
        >
          <h1 className="section__title">
            {t('sectionTitle')}
          </h1>

          <p className="section__description">
            {t('sectionDescription')}
          </p>

          <div className="section__icons">
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

        </div>

        <div
          ref={imageRef}
          className={`section__image-wrapper ${imageInView ? `${ANIMATION_CLASSES.FADE_IN_LEFT} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
          style={{ animationDelay: ANIMATION_CONFIG.DELAY.LONG }}
        >
          <img
            src={heroImage}
            alt="Game Screenshot"
            className="section__image"
          />
        </div>
      </div>
    </section>
  );
};

export default Section;