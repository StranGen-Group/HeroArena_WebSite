/**
 * Константы для анимаций
 */
export const ANIMATION_CONFIG = {
  // Порог видимости для Intersection Observer (0-1)
  THRESHOLD: {
    LOW: 0.1,
    MEDIUM: 0.2,
    HIGH: 0.3,
  },
  
  // Задержки анимаций (в секундах)
  DELAY: {
    SHORT: '0.1s',
    MEDIUM: '0.2s',
    LONG: '0.3s',
    EXTRA_LONG: '0.4s',
  },
  
  // Длительность загрузки прелоадера (в миллисекундах)
  PRELOADER_DURATION: 2500,
};

export const ANIMATION_CLASSES = {
  HIDDEN: 'hidden-until-inview',
  FADE_IN_LEFT: 'fade-in-left',
  FADE_IN_RIGHT: 'fade-in-right',
  FADE_IN_UP: 'fade-in-up',
  FADE_IN_DOWN: 'fade-in-down',
  FADE_IN: 'fade-in',
  ANIMATED: 'animated',
};

