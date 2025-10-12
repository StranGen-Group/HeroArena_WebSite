import React, { useState, useEffect } from 'react';

import Preloader from './component/preloader/Preloader';
import Header from './component/header/Header';
import HeroSection from './component/hero/HeroSection';
import AboutSection from './component/about/AboutSection';

import './App.scss';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Симулируем загрузку приложения
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Уменьшил время до 2.5 секунд

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="app">
      <Header />
      <AboutSection />
      <HeroSection />
    </div>
  );
}

export default App;