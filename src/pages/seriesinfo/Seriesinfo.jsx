import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./Serinfo.scss";

const Seriesinfo = () => {
  const { id } = useParams();
  const [seriesData, setSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        const res = await axios.get(`https://backendnetflix-paxc.onrender.com/api/series/${id}/seasons`);
        setSeriesData(res.data);
        setLoading(false);
        if (res.data.length > 0) {
          setSelectedSeason(res.data[0]._id);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [id]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (selectedSeason) {
        try {
          const res = await axios.get(`https://backendnetflix-paxc.onrender.com/api/seasons/${selectedSeason}`);
          setEpisodes(res.data);
        } catch (err) {
          console.error("Error fetching episodes:", err);
        }
      }
    };

    fetchEpisodes();
  }, [selectedSeason]);

  const handleSeasonChange = async (e) => {
    const seasonId = e.target.value;
    setSelectedSeason(seasonId);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="series-info">
      <h1>Information sur votre série</h1>
      <h3>Nombre de saisons: {seriesData.length}</h3>
      <label htmlFor="season-select">Sélectionnez une saison:</label>
      <select
        id="season-select"
        value={selectedSeason}
        onChange={handleSeasonChange}
      >
        {seriesData.map((season, index) => (
          <option key={season._id} value={season._id}>
            Saison {index + 1}
          </option>
        ))}
      </select>
      {selectedSeason && (
        <div>
          <h4>Informations sur la saison sélectionnée:</h4>
          <ul className="episode-list">
            {episodes.map((episode) => (
              <li key={episode._id}>
                <h5>{episode.title}</h5>
                <p>{episode.desc}</p>
                <p>Durée: {episode.duration} minutes</p>
                <Link to={{ pathname: "/watch", state: { movie: episode } }}>
                  <button>Watch Now</button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Seriesinfo;
