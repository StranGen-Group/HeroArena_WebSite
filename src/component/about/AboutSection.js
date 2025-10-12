import React from 'react';
import './AboutSection.scss';
import aboutImage from '../../assets/image/about/about-image.png'; // Замените на ваше изображение

const AboutSection = () => {
  return (
    <section className="about" id="home">
      <div className="about__content">
        <div className="about__text-content">
          <h2 className="about__title">
            Какие мы крутые
          </h2>
          
          <p className="about__description">
            Мы — команда талантливых разработчиков, которые не просто создают игры, 
            а воплощают мечты в реальность.
          </p>

          <div className="about__buttons">
            <button className="about__button about__button--primary">
              <span className="about__button-text">Узнать больше</span>
            </button>
            
            <button className="about__button about__button--secondary">
              <span className="about__button-text">Наша команда</span>
            </button>
          </div>
        </div>

        <div className="about__image-wrapper">
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

export default AboutSection;
