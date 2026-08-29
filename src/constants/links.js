/**
 * Ссылки на внешние ресурсы
 */
export const APP_LINKS = {
  GOOGLE_PLAY: 'https://play.google.com/store',
  APP_STORE: 'https://www.apple.com/app-store/',
  
  SOCIAL: {
    DISCORD: 'https://discord.gg/XDNaVyuhr7',
    INSTAGRAM: 'https://www.instagram.com/strangengroup',
    YOUTUBE: 'https://www.youtube.com/@strangen2454',
    TELEGRAM: 'https://t.me/StrangenGroup',
    X: 'https://twitter.com/StrangeNGroup',
    FACEBOOK: 'https://www.facebook.com/StrangenGroup'
  },
};

export const VIDEO_LINKS = {
  VIDEO_1: 'https://www.youtube.com/embed/jtizXjSsGoQ?si=qjmpik8hpK0lxNlV',
  VIDEO_2: 'https://www.youtube.com/embed/6P_fh79wiJc?si=KfZBNjqM5S5uFYHF',
};

/**
 * Pulls the video id out of a `.../embed/<id>?...` URL so the id lives in one
 * place instead of being hardcoded wherever a poster/watch link is built.
 */
export const getVideoId = (embedUrl) => embedUrl.split('/embed/')[1].split('?')[0];

/**
 * Секции сайта для навигации
 */
export const SECTIONS = {
  HOME: 'home', // top of page: the game (HeroSection) after the reorder
  STUDIO: 'studio', // studio pitch (HeaderContent), now second on the page
  GALLERY: 'gallery',
  TRAILER: 'trailer',
  SOCIALS: 'socials',
};

