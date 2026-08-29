import React, { useState, useRef, useEffect, useCallback } from 'react';
import './HeroSectionSlider.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import useInView from '../../hooks/useInView';
import { SLIDER_SLIDES, SLIDER_CONFIG } from '../../constants/slider';
import { SECTIONS } from '../../constants/links';
import { ANIMATION_CONFIG, ANIMATION_CLASSES } from '../../constants/animation';
import { track } from '../../utils/analytics';
import { useLanguage } from '../../context/LanguageContext';

const HeroSectionSlider = () => {
    const { t } = useLanguage();
    const [sliderRef, sliderInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
    const openerRef = useRef(null);
    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        document.body.style.overflow = ''; // Восстанавливаем прокрутку
        if (openerRef.current) openerRef.current.focus();
    }, []);

    const handleSlideClick = (index, event) => {
        track('gallery_open', { index });
        openerRef.current = event.currentTarget;
        setSelectedSlideIndex(index);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
    };

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('slider-modal')) {
            closeModal();
        }
    };

    useEffect(() => {
        if (!isModalOpen) return undefined;

        if (closeButtonRef.current) closeButtonRef.current.focus();

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                return;
            }
            if (e.key !== 'Tab' || !modalRef.current) return;

            // keep focus inside the dialog while it is open
            const focusable = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isModalOpen, closeModal]);

    return (
        <section className="slider" id={SECTIONS.GALLERY}>
            <div className="slider__content">
                <div
                    ref={sliderRef}
                    className={`slider__slider-wrapper ${sliderInView ? `${ANIMATION_CLASSES.FADE_IN_UP} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
                >
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        grabCursor={true}
                        slidesPerView={SLIDER_CONFIG.BREAKPOINTS[1024].slidesPerView}
                        spaceBetween={SLIDER_CONFIG.BREAKPOINTS[1024].spaceBetween}
                        loop={true}
                        navigation={SLIDER_CONFIG.NAVIGATION}
                        pagination={SLIDER_CONFIG.PAGINATION}
                        autoplay={SLIDER_CONFIG.AUTOPLAY}
                        speed={SLIDER_CONFIG.SPEED}
                        breakpoints={SLIDER_CONFIG.BREAKPOINTS}
                        className="slider-swiper"
                    >
                        {SLIDER_SLIDES.map((slide, index) => (
                            <SwiperSlide key={slide.id}>
                                <div
                                    className="slider__slide"
                                    role="button"
                                    tabIndex={0}
                                    onClick={(event) => handleSlideClick(index, event)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleSlideClick(index, e);
                                        }
                                    }}
                                >
                                    <div className="slider__slide-image-container">
                                        <img
                                            src={slide.src}
                                            srcSet={slide.srcSet}
                                            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                            width={slide.width}
                                            height={slide.height}
                                            alt="Hero Arena gameplay screenshot"
                                            className="slider__slide-image"
                                            loading="lazy"
                                        />
                                    </div>
                                    <p className="slider__slide-caption">{t(slide.captionKey)}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="slider__nav-button slider__nav-button--prev">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="slider__nav-button slider__nav-button--next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <div
                    className="slider-modal"
                    onClick={handleBackdropClick}
                    ref={modalRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Gallery"
                >
                    <button
                        className="slider-modal__close"
                        onClick={closeModal}
                        aria-label="Close gallery"
                        ref={closeButtonRef}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <div className="slider-modal__content">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            grabCursor={true}
                            slidesPerView={1}
                            spaceBetween={0}
                            loop={true}
                            navigation={{
                                prevEl: '.slider-modal__nav--prev',
                                nextEl: '.slider-modal__nav--next',
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            initialSlide={selectedSlideIndex}
                            className="slider-modal__swiper"
                        >
                            {SLIDER_SLIDES.map((slide) => (
                                <SwiperSlide key={slide.id}>
                                    <div className="slider-modal__slide">
                                        <img
                                            src={slide.src}
                                            srcSet={slide.srcSet}
                                            sizes="100vw"
                                            width={slide.width}
                                            height={slide.height}
                                            alt="Hero Arena gameplay screenshot"
                                            className="slider-modal__image"
                                            loading="eager"
                                        />
                                        <p className="slider-modal__caption">{t(slide.captionKey)}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="slider-modal__nav slider-modal__nav--prev">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="slider-modal__nav slider-modal__nav--next">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default HeroSectionSlider;