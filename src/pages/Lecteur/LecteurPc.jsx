import { ArrowBackOutlined } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-http-source-selector";
import "./lecteur.scss"
export default function LecteurPC() {
  const location = useLocation();
  const movie = location.state?.movie;
  const videoRef = useRef(null);

  useEffect(() => {
    if (movie && videoRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true,
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
            src: movie.subtitles,
            default: true,
          },
          {
            kind: "captions",
            label: "French",
            srclang: "fr",
            src: "/path/to/your/subtitles/french.vtt", // Remplacer par l'URL correcte
          },
        ],
      });

      player.ready(function() {
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
  }, [movie]);

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
