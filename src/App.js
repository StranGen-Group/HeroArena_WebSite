import React, { useState, useEffect } from 'react';

import { LanguageProvider } from './context/LanguageContext';
import { ANIMATION_CONFIG } from './constants/animation';

import Preloader from './component/preloader/Preloader';
import Header from './component/header/Header';
import HeroSection from './component/hero/HeroSection';
import HeaderContent from './component/headerContent/HeaderContent';
import Section from './component/section/Section';
import VideoContent from './component/video/VideoContent';
import HeroSectionSlider from './component/slider/HeroSectionSlider';
import ContactSection from './component/contact/ContactSection';
import Footer from './component/footer/Footer';

import './App.scss';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Симулируем загрузку приложения
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, ANIMATION_CONFIG.PRELOADER_DURATION);

    return () => clearTimeout(timer);
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
        <ContactSection />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;