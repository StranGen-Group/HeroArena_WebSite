import React from 'react';
import './Section.scss';
import heroImage from '../../assets/image/phone/iPhone1.png';
import { useLanguage } from '../../context/LanguageContext';
import useInView from '../../hooks/useInView';
import { ANIMATION_CONFIG, ANIMATION_CLASSES } from '../../constants/animation';
import { SECTIONS } from '../../constants/links';

const Section = () => {
  const { t } = useLanguage();
  const [textRef, textInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });
  const [imageRef, imageInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });

  return (
    <section className="section" id={SECTIONS.OUR_TEAM}>
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