import { useEffect, useRef, useState } from 'react';

/**
 * Хук для отслеживания видимости элемента в viewport
 * @param {Object} options - Настройки Intersection Observer
 * @param {number} options.threshold - Порог видимости (0-1)
 * @param {string} options.rootMargin - Отступы для root
 * @param {boolean} options.triggerOnce - Запускать анимацию только один раз
 */
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Если triggerOnce = true, отключаем наблюдение после первого срабатывания
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isInView];
};

export default useInView;

