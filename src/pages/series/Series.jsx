import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import { NavLink, Route } from "react-router-dom/cjs/react-router-dom.min";
import "./Series.css"; // Import the CSS file for styling

const Series = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await axios.get("https://backendnetflix-paxc.onrender.com/api/series");
        setSeries(response.data); // Update the state with the fetched series
      } catch (error) {
        setError("Erreur lors de la récupération des séries");
        console.error("Erreur lors de la récupération des séries :", error);
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchSeries();
  }, []);

  return (
    <div className="series-page">
      <Navbar />
      <br />
      <br />
      <br />
      <br />
      <div className="content">
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <ul className="series-list">
            {series.map((serie) => (
              <li key={serie._id} className="series-item">
                <NavLink className="navinfo" to={`/seriesinfo/${serie._id}`}>
                  <h2>{serie.title}</h2>
                  <p>{serie.desc}</p>
                  {serie.img && (
                    <img
                      src={serie.img}
                      alt={serie.title}
                      className="series-img"
                    />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Series;
