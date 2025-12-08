import React from 'react';
import './HeaderContent.scss';
import aboutImage from '../../assets/image/about/mage.png';
import { useLanguage } from '../../context/LanguageContext';
import useInView from '../../hooks/useInView';
import { ANIMATION_CONFIG, ANIMATION_CLASSES } from '../../constants/animation';
import { SECTIONS } from '../../constants/links';

const HeaderContent = () => {
  const { t } = useLanguage();
  const [titleRef, titleInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });
  const [textRef, textInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.MEDIUM });
  const [imageRef, imageInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.MEDIUM });

  return (
    <section className="about" id={SECTIONS.HOME}>
      <div className="about__content">
        <div
          ref={titleRef}
          className={`about__text-content ${titleInView ? `${ANIMATION_CLASSES.FADE_IN_LEFT} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
        >
          <h2 className="about__title">
            {t('headerContentTitle')}
          </h2>

          <p
            ref={textRef}
            className={`about__description ${textInView ? `${ANIMATION_CLASSES.FADE_IN_LEFT} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
            style={{ animationDelay: ANIMATION_CONFIG.DELAY.MEDIUM }}
          >
            {t('headerContentDescription')}
          </p>
        </div>

        <div
          ref={imageRef}
          className={`about__image-wrapper ${imageInView ? `${ANIMATION_CLASSES.FADE_IN_RIGHT} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
          style={{ animationDelay: ANIMATION_CONFIG.DELAY.LONG }}
        >
          <img
            src={aboutImage}
            alt="About our team"
            className="about__image"
          />
        </div>
      </div>
    </section>
  );
};

export default HeaderContent;