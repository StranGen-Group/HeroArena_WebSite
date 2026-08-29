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
  
  // Задержки анимаций: шаг 70 мс — стаггер между соседями одного блока
  DELAY: {
    SHORT: '0.07s',
    MEDIUM: '0.14s',
    LONG: '0.21s',
    EXTRA_LONG: '0.28s',
  },
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

