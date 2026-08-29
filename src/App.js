import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { LanguageProvider } from './context/LanguageContext';

import Preloader from './component/preloader/Preloader';
import Header from './component/header/Header';
import HeroSection from './component/hero/HeroSection';
import HeaderContent from './component/headerContent/HeaderContent';
import Section from './component/section/Section';
import VideoContent from './component/video/VideoContent';
import HeroSectionSlider from './component/slider/HeroSectionSlider';
import Footer from './component/footer/Footer';

import './App.scss';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const done = () => setIsLoading(false);
    // ceiling: never hold the page hostage if an asset stalls
    const ceiling = setTimeout(done, 1500);

    if (document.readyState === 'complete') {
      done();
    } else {
      window.addEventListener('load', done);
    }

    return () => {
      clearTimeout(ceiling);
      window.removeEventListener('load', done);
    };
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LanguageProvider>
      <div className="app">
        <Header />
        <HeaderContent />
        <HeroSection />
        <HeroSectionSlider />
        <Section />
        <VideoContent />
        <Footer />
        <Analytics />
        <SpeedInsights />
      </div>
    </LanguageProvider>
  );
}

export default App; 