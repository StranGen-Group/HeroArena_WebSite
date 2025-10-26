// VideoContent.jsx
import React from 'react';
import './VideoContent.scss';

const VideoContent = () => {
  return (
    <section className="video-content">
      <div className="video-content__container">
        
        <div className="video-content__grid">
          <div className="video-content__item">
            <div className="video-content__frame">
              <iframe 
                className="video-content__player"
                src="https://www.youtube.com/embed/jtizXjSsGoQ?si=qjmpik8hpK0lxNlV" 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>

            <div className="video-content__info">
              <h3 className="video-content__video-title">Official Trailer</h3>
              <p className="video-content__description">Watch the epic battle unfold</p>
            </div>
          </div>

          <div className="video-content__item">
            <div className="video-content__frame">
              <iframe 
                className="video-content__player"
                src="https://www.youtube.com/embed/6P_fh79wiJc?si=KfZBNjqM5S5uFYHF" 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="video-content__info">
              <h3 className="video-content__video-title">Gameplay Trailer</h3>
              <p className="video-content__description">See the action in motion</p>
            </div>
          </div>
        </div>
      
      </div>
    </section>
  );
}

export default VideoContent;