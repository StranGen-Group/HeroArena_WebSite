import React from 'react';
import './Section.scss';
import heroImage from '../../assets/image/phone/iPhone1.png';
import googlePlayIcon from '../../assets/image/icons/google-play.svg';
import appStoreIcon from '../../assets/image/icons/app-store.svg';

const Section = () => {
  return (
    <section className="section" id="about-game">
      <div className="section__background">
        <div className="section__shape hero__shape--cyan"></div>
      </div>

      <div className="section__content">
        

        <div className="section__text-content">
          <h1 className="section__title">
            Это потрясающая игра
          </h1>
          
          <p className="section__description">
            В этой игре столько страданий, помогите нам денежкой! 
            Поддержите разработку и станьте частью нашей истории.
          </p>
        </div>

        <div className="section__image-wrapper">
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