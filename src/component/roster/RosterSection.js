import React from 'react';
import './RosterSection.scss';
import hero1 from '../../assets/image/heroes/hero-3.webp';
import hero2 from '../../assets/image/heroes/hero-4.webp';
import hero3 from '../../assets/image/heroes/hero-1.webp';
import hero4 from '../../assets/image/heroes/hero-2.webp';
import { useLanguage } from '../../context/LanguageContext';
import useInView from '../../hooks/useInView';
import { ANIMATION_CONFIG, ANIMATION_CLASSES } from '../../constants/animation';
import { SECTIONS } from '../../constants/links';

// Card order follows the brief's table, not the source atlas's numbering —
// hero-3.png is Swordsman, hero-4.png is Archer, and so on.
const ROSTER = [
  { image: hero1, nameKey: 'rosterHero1Name', roleKey: 'rosterHero1Role', descriptionKey: 'rosterHero1Description' },
  { image: hero2, nameKey: 'rosterHero2Name', roleKey: 'rosterHero2Role', descriptionKey: 'rosterHero2Description' },
  { image: hero3, nameKey: 'rosterHero3Name', roleKey: 'rosterHero3Role', descriptionKey: 'rosterHero3Description' },
  { image: hero4, nameKey: 'rosterHero4Name', roleKey: 'rosterHero4Role', descriptionKey: 'rosterHero4Description' },
];

const RosterSection = () => {
  const { t } = useLanguage();
  const [rowRef, rowInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.MEDIUM });

  return (
    <section className="roster" id={SECTIONS.ROSTER}>
      <div className="roster__content">
        <span className="roster__eyebrow" aria-hidden="true">{t('waveRoster')}</span>
        <h2 className="roster__title">{t('rosterTitle')}</h2>
        <p className="roster__status">{t('rosterStatus')}</p>

        <div
          ref={rowRef}
          className={`roster__row ${rowInView ? `${ANIMATION_CLASSES.FADE_IN_UP} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
        >
          {ROSTER.map((heroCard) => (
            <div
              className="roster__card"
              key={heroCard.nameKey}
            >
              <div className="roster__portrait">
                <img src={heroCard.image} alt="" width={256} height={256} loading="lazy" />
                <span className="roster__rank" aria-hidden="true">★</span>
              </div>
              <h3 className="roster__name">{t(heroCard.nameKey)}</h3>
              <span className="roster__role">{t(heroCard.roleKey)}</span>
              <p className="roster__description">{t(heroCard.descriptionKey)}</p>
            </div>
          ))}

          <div className="roster__card roster__card--locked">
            <div className="roster__portrait roster__portrait--locked">
              <svg className="roster__lock" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              <span className="roster__more" aria-hidden="true">+28</span>
            </div>
            <p className="roster__locked-label">{t('rosterLockedLabel')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RosterSection;
