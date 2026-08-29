import React, { useState } from 'react';
import './VideoContent.scss';
import YoutubeIcon from '../../assets/image/icons/youtube-icon.svg';
import { useLanguage } from '../../context/LanguageContext';
import useInView from '../../hooks/useInView';
import { VIDEO_LINKS, SECTIONS, getVideoId } from '../../constants/links';
import { ANIMATION_CONFIG, ANIMATION_CLASSES } from '../../constants/animation';
import { track } from '../../utils/analytics';

const PLAY_ANALYTICS_ID = { 0: 'pitch', 1: 'trailer' };

const VideoContent = () => {
  const { t } = useLanguage();
  const [video1Ref, video1InView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });
  const [video2Ref, video2InView] = useInView({ threshold: ANIMATION_CONFIG.THRESHOLD.HIGH });
  // which trailers have been clicked to load their real iframe
  const [playing, setPlaying] = useState({});

  const handlePlay = (index) => {
    track('trailer_play', { video: PLAY_ANALYTICS_ID[index] });
    setPlaying((current) => ({ ...current, [index]: true }));
  };

  const videos = [
    {
      src: VIDEO_LINKS.VIDEO_1,
      id: getVideoId(VIDEO_LINKS.VIDEO_1),
      title: t('videoTitle1'),
      ref: video1Ref,
      inView: video1InView
    },
    {
      src: VIDEO_LINKS.VIDEO_2,
      id: getVideoId(VIDEO_LINKS.VIDEO_2),
      title: t('videoTitle2'),
      ref: video2Ref,
      inView: video2InView,
      delay: ANIMATION_CONFIG.DELAY.MEDIUM
    },
  ];

  return (
    <section className="video-content" id={SECTIONS.TRAILER}>
      <div className="video-content__container">
        <h2 className="video-content__title">{t('videoSectionTitle')}</h2>

        <div className="video-content__grid">
          {videos.map((video, index) => (
            <div 
              key={index}
              ref={video.ref}
              className={`video-content__item ${video.inView ? `${ANIMATION_CLASSES.FADE_IN_UP} ${ANIMATION_CLASSES.ANIMATED}` : ANIMATION_CLASSES.HIDDEN}`}
              style={{ animationDelay: video.delay }}
            >
              {playing[index] ? (
                <div className="video-content__frame">
                  <iframe
                    className="video-content__player"
                    src={`${video.src}&autoplay=1`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <button
                  type="button"
                  className="video-content__frame video-content__poster"
                  onClick={() => handlePlay(index)}
                  aria-label={`Play ${video.title}`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    alt=""
                    className="video-content__poster-image"
                    width={1280}
                    height={720}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                    }}
                  />
                  <svg
                    className="video-content__play-icon"
                    width="72"
                    height="72"
                    viewBox="0 0 72 72"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="36" cy="36" r="35" fill="var(--ha-blue)" />
                    <path d="M29 23L50 36L29 49V23Z" fill="var(--on-blue)" />
                  </svg>
                </button>
              )}

              <div className="video-content__info">
                <h3 className="video-content__video-title">{video.title}</h3>
                <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                  <img
                    src={YoutubeIcon}
                    alt="YouTube Icon"
                    className="video-content__youtube-icon"
                    width={60}
                    height={60}
                  />
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