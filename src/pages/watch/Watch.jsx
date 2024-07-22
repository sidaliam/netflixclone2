import { ArrowBackOutlined } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-http-source-selector";
import "./watch.scss";

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
    if (movie && videoRef.current) {
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
      });

      // Ajouter des sous-titres de manière dynamique
      player.ready(function() {
        const trackEn = document.createElement("track");
        trackEn.kind = "captions";
        trackEn.label = "English";
        trackEn.srclang = "en";
        trackEn.src = movie.subtitles;
        trackEn.default = true;
        videoRef.current.appendChild(trackEn);

        const trackFr = document.createElement("track");
        trackFr.kind = "captions";
        trackFr.label = "French";
        trackFr.srclang = "fr";
        trackFr.src = "/path/to/your/subtitles/french.vtt"; // Remplacer par l'URL correcte
        videoRef.current.appendChild(trackFr);

        const tracks = player.textTracks();
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];
          if (track.kind === "captions" || track.kind === "subtitles") {
            track.mode = "showing"; // Affiche les sous-titres
          }
        }

        if (player.httpSourceSelector) {
          player.httpSourceSelector({
            default: 'auto'
          });
        } else {
          console.error("httpSourceSelector plugin is not available.");
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
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-default-skin"
            controls
            preload="auto"
          />
        </div>
      ) : (
        <p>Movie not found</p>
      )}
    </div>
  );
}
