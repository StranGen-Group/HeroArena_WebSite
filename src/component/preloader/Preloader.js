import React from 'react';
import './Preloader.scss';
import LogoStr from '../../assets/image/logo/logo_str.png';

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="preloader__content">
        <div className="preloader__logo-container">
          <img 
            src={LogoStr}
            alt="Loading..." 
            className="preloader__logo"
          />
        </div>
        <div className="preloader__spinner"></div>
      </div>
    </div>
  );
};

export default Preloader;