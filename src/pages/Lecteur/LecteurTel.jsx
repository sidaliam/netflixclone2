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
  
  export default function LecteurTel() {
    const location = useLocation();
    const movie = location.state?.movie;
    const videoRef = useRef(null);
    const playerRef = useRef(null);
  
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
        });
  
        player.ready(function () {
          playerRef.current = player;
  
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
              default: "auto",
            });
          } else {
            console.error("httpSourceSelector plugin is not available.");
          }
  
          // Hide background image when the video starts playing
          player.on("play", () => {
            document.querySelector(".video-container").classList.add("playing");
          });
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
            style={{ backgroundImage: `url(${movie.img})` }}
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
                  Année :<h5>{movie.year}</h5>
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
  