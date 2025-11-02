import React from 'react';
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

const HeroSectionSlider = () => {
    const [sliderRef, sliderInView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });
    
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
                    {SLIDER_SLIDES.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div className="slider__slide">
                                <div className="slider__slide-image-container">
                                    <img
                                        src={slide.img}
                                        alt="Game screenshot"
                                        className="slider__slide-image"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="slider__nav-button slider__nav-button--prev">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <div className="slider__nav-button slider__nav-button--next">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    </section>
    );
};

export default HeroSectionSlider;