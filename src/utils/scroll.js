/**
 * Утилиты для работы со скроллом
 */

/**
 * Плавная прокрутка к элементу по ID
 * @param {string} sectionId - ID секции
 * @param {object} options - Дополнительные опции
 */
export const scrollToSection = (sectionId, options = {}) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      ...options 
    });
  }
};

/**
 * Прокрутка к началу страницы
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

/**
 * Проверка, находится ли элемент в viewport
 * @param {HTMLElement} element - Элемент для проверки
 * @param {number} threshold - Порог видимости (0-1)
 * @returns {boolean}
 */
export const isInViewport = (element, threshold = 0) => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
  
  const visibleArea = Math.max(0, visibleHeight * visibleWidth);
  const totalArea = rect.height * rect.width;

  return visibleArea / totalArea >= threshold;
};

