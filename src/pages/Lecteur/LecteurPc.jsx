import {
    ArrowBackOutlined,
    AccessTime,
    CalendarToday,
  } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-http-source-selector";
import "./lecteur.scss";
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

      player.ready(function () {
        const tracks = player.textTracks();
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];
          if (track.kind === "captions" || track.kind === "subtitles") {
            track.mode = "showing"; // Affiche les sous-titres
          }
        }

        if (player.httpSourceSelector) {
          player.httpSourceSelector({
            default: "auto",
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
      <br />
      <br />
      <br />
      {movie ? (
        <div
          data-vjs-player
          className="video-container"
          style={{ backgroundImage: `url(${movie.img}) center/cover` }}
        >
          <video
            ref={videoRef}
            className="video-js vjs-default-skin"
            controls
            preload="auto"
          />

          {movie.desc && (
            <div className="descriptionmovie">
              <h5>{movie.desc}</h5>
              <br />
              <div className="item">
                <AccessTime className="icon" />
                Durée :<h5>{movie.duration}</h5>
              </div>
              <br />
              <div className="item">
                <CalendarToday className="icon" />
                <h5>   {movie.year}</h5>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Movie not found</p>
      )}
    </div>
  );
}
