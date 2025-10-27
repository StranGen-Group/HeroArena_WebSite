import React from 'react';
import './VideoContent.scss';
import YoutubeIcon from '../../assets/image/icons/youtube-icon.svg';
import { useLanguage } from '../../context/LanguageContext';
import useInView from '../../hooks/useInView';
import { VIDEO_LINKS, SECTIONS } from '../../constants/links';
import { ANIMATION_CONFIG, ANIMATION_CLASSES } from '../../constants/animation';

const VideoContent = () => {
  const { t } = useLanguage();
  const [video1Ref, video1InView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });
  const [video2Ref, video2InView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });

  const videos = [
    { 
      src: VIDEO_LINKS.VIDEO_1, 
      title: t('videoTitle1'), 
      ref: video1Ref, 
      inView: video1InView 
    },
    { 
      src: VIDEO_LINKS.VIDEO_2, 
      title: t('videoTitle2'), 
      ref: video2Ref, 
      inView: video2InView,
      delay: ANIMATION_CONFIG.DELAY.MEDIUM
    },
  ];

  return (
    <section className="video-content" id={SECTIONS.TRAILER}>
      <div className="video-content__container">
        
        <div className="video-content__grid">
          {videos.map((video, index) => (
            <div 
              key={index}
              ref={video.ref}
              className={`video-content__item ${video.inView ? `${ANIMATION_CLASSES.FADE_IN_UP} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
              style={{ animationDelay: video.delay }}
            >
              <div className="video-content__frame">
                <iframe 
                  className="video-content__player"
                  src={video.src} 
                  title="YouTube video player" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>

              <div className="video-content__info">
                <h3 className="video-content__video-title">{video.title}</h3>
                <a href={video.src}>
                  <img src={YoutubeIcon} alt="YouTube Icon" className="video-content__youtube-icon" />
                </a>
              </div>
            </div>
          ))}
        </div>
      
      </div>
    </section>
  );
}

export default VideoContent;