import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { LanguageProvider } from './context/LanguageContext';

import Preloader from './component/preloader/Preloader';
import Header from './component/header/Header';
import HeroSection from './component/hero/HeroSection';
import RosterSection from './component/roster/RosterSection';
import HeaderContent from './component/headerContent/HeaderContent';
import Section from './component/section/Section';
import VideoContent from './component/video/VideoContent';
import HeroSectionSlider from './component/slider/HeroSectionSlider';
import Footer from './component/footer/Footer';

import './App.scss';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // floor: the StranGen mark has to be on screen long enough to register
    const MIN_VISIBLE = 800;
    // ceiling: never hold the page hostage if an asset stalls
    const MAX_VISIBLE = 1500;
    const shownAt = Date.now();
    const hide = () => setIsLoading(false);

    let floor;
    const done = () => {
      const remaining = MIN_VISIBLE - (Date.now() - shownAt);
      if (remaining > 0) {
        floor = setTimeout(hide, remaining);
      } else {
        hide();
      }
    };

    // the ceiling is independent of the floor: it hides regardless
    const ceiling = setTimeout(hide, MAX_VISIBLE);

    if (document.readyState === 'complete') {
      done();
    } else {
      window.addEventListener('load', done);
    }

    return () => {
      clearTimeout(ceiling);
      clearTimeout(floor);
      window.removeEventListener('load', done);
    };
  }, []);

  return (
    <>
      <Analytics />
      <SpeedInsights />
      {isLoading ? (
        <Preloader />
      ) : (
        <LanguageProvider>
          <div className="app">
            <a className="skip-link" href="#main-content">Skip to content</a>
            <Header />
            <main id="main-content" tabIndex="-1">
              <HeroSection />
              <RosterSection />
              <HeroSectionSlider />
              <VideoContent />
              <HeaderContent />
              <Section />
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      )}
    </>
  );
}

export default App;
