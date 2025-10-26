import React from 'react';
import './HeroSectionSlider.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import slide1 from '../../assets/image/background/bg1.png';
import slide2 from '../../assets/image/background/bg1.png';
import slide3 from '../../assets/image/background/bg1.png';
import slide4 from '../../assets/image/background/bg1.png';
import slide5 from '../../assets/image/background/bg1.png';

const slides = [
    { id: 1, img: slide1 },
    { id: 2, img: slide2 },
    { id: 3, img: slide3 },
    { id: 4, img: slide4 },
    { id: 5, img: slide5 },
];

const HeroSectionSlider = () => (
    <section className="slider" id="about-game">
        <div className="slider__content">
            <div className="slider__slider-wrapper">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    grabCursor={true}
                    slidesPerView={3}
                    spaceBetween={20}
                    loop={true}
                    navigation={{
                        nextEl: '.slider__nav-button--next',
                        prevEl: '.slider__nav-button--prev',
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    speed={600}
                    breakpoints={{
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
                    }}
                    className="slider-swiper"
                >
                    {slides.map((slide) => (
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

export default HeroSectionSlider;