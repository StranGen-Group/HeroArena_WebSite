/**
 * Константы для слайдера
 */
import slide1_800 from '../assets/image/background/screenshot1-800.webp';
import slide1_1600 from '../assets/image/background/screenshot1-1600.webp';
import slide2_800 from '../assets/image/background/screenshot2-800.webp';
import slide2_1600 from '../assets/image/background/screenshot2-1600.webp';
import slide3_800 from '../assets/image/background/screenshot3-800.webp';
import slide3_1600 from '../assets/image/background/screenshot3-1600.webp';
import slide4_800 from '../assets/image/background/screenshot4-800.webp';
import slide4_1600 from '../assets/image/background/screenshot4-1600.webp';
import slide5_800 from '../assets/image/background/screenshot5-800.webp';
import slide5_1600 from '../assets/image/background/screenshot5-1600.webp';

const slide = (id, small, large) => ({
  id,
  src: large,
  srcSet: `${small} 800w, ${large} 1600w`,
  width: 1600,
  height: 842,
});

export const SLIDER_SLIDES = [
  slide(1, slide1_800, slide1_1600),
  slide(2, slide2_800, slide2_1600),
  slide(3, slide3_800, slide3_1600),
  slide(4, slide4_800, slide4_1600),
  slide(5, slide5_800, slide5_1600),
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
