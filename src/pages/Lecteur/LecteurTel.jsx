import { ArrowBackOutlined } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-http-source-selector";
import "./lecteur.scss"
export default function LecteurTel() {
  const location = useLocation();
  const movie = location.state?.movie;
  const videoRef = useRef(null);

  useEffect(() => {
    if (movie && videoRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true, // Ensure the player is responsive
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

      player.ready(function() {
        // Add English subtitles
        const trackEn = document.createElement("track");
        trackEn.kind = "captions";
        trackEn.label = "English";
        trackEn.srclang = "en";
        trackEn.src = movie.subtitles;
        trackEn.default = true;
        videoRef.current.appendChild(trackEn);

        // Add French subtitles
        const trackFr = document.createElement("track");
        trackFr.kind = "captions";
        trackFr.label = "French";
        trackFr.srclang = "fr";
        trackFr.src = "/path/to/your/subtitles/french.vtt"; // Replace with the correct URL
        videoRef.current.appendChild(trackFr);

        const tracks = player.textTracks();
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];
          if (track.kind === "captions" || track.kind === "subtitles") {
            track.mode = "showing"; // Show subtitles
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
