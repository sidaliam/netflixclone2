import { ArrowBackOutlined } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-http-source-selector";
import "./watch.scss";
import ReactPlayer from 'react-player';

export default function Watch() {
  const location = useLocation();
  const movie = location.state?.movie;
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentQuality, setCurrentQuality] = useState(movie?.video);

  const handleQualityChange = (qualityUrl) => {
    setCurrentQuality(qualityUrl);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (movie && videoRef.current && !isMobile) {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        sources: [
          {
            src: movie.video,
            type: "video/mp4",
            label: "720p",
            res: 720,
            selected: true,
          },
          {
            src: movie.video,
            type: "video/mp4",
            label: "1080p",
            res: 1080,
          },
        ],
        tracks: [
          {
            kind: "captions",
            label: "English",
            srclang: "en",
            src: movie.subtitles, // URL des sous-titres en anglais
            default: true,
          },
          {
            kind: "captions",
            label: "French",
            srclang: "fr",
            src: "/path/to/your/subtitles/french.vtt", // Remplacer par l'URL correcte pour les sous-titres français
          },
        ],
      });

      if (player.httpSourceSelector) {
        player.httpSourceSelector({
          default: 'auto'
        });
      } else {
        console.error("httpSourceSelector plugin is not available.");
      }

      player.ready(function() {
        const tracks = player.textTracks();
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];
          if (track.kind === "captions" || track.kind === "subtitles") {
            track.mode = "showing"; // Affiche les sous-titres
          }
        }
      });

      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, [movie, isMobile]);

  return (
    <div className="watch">
      <Link to="/">
        <div className="back">
          <ArrowBackOutlined />
          Home
        </div>
      </Link>
      {movie ? (
        isMobile ? (
          <div>
            <ReactPlayer
              className="react-player"
              url={currentQuality}
              controls
              width="100%"
              height="100%"
            />
            <div className="controls-overlay">
              <label style={{color:"white"}}> Qualité :</label>
              <br />
              <div className="quality-controls">
                <button onClick={() => handleQualityChange(movie.video)}>720p</button>
                <button onClick={() => handleQualityChange(movie.video)}>1080p</button>
              </div>
              <br />
              <label style={{color:"white"}} >Subtitles:</label>
              <br />
              <div className="caption-controls">
                <select>
                  <option value={movie.subtitles}>English</option>
                  <option value={movie.subtitles}>French</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div data-vjs-player>
            <video
              ref={videoRef}
              className="video-js vjs-default-skin"
              controls
              preload="auto"
            />
          </div>
        )
      ) : (
        <p>Movie not found</p>
      )}
    </div>
  );
}
