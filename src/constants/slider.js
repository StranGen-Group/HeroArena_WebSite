/**
 * Константы для слайдера
 */
import slide1 from '../assets/image/background/bg1.png';
import slide2 from '../assets/image/background/bg1.png';
import slide3 from '../assets/image/background/bg1.png';
import slide4 from '../assets/image/background/bg1.png';
import slide5 from '../assets/image/background/bg1.png';

export const SLIDER_SLIDES = [
  { id: 1, img: slide1 },
  { id: 2, img: slide2 },
  { id: 3, img: slide3 },
  { id: 4, img: slide4 },
  { id: 5, img: slide5 },
];

export const SLIDER_CONFIG = {
  MODULES: ['Navigation', 'Pagination', 'Autoplay'],
  
  NAVIGATION: {
    nextEl: '.slider__nav-button--next',
    prevEl: '.slider__nav-button--prev',
  },
  
  PAGINATION: {
    clickable: true,
    dynamicBullets: true,
  },
  
  AUTOPLAY: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  
  SPEED: 600,
  
  BREAKPOINTS: {
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 25,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
};

