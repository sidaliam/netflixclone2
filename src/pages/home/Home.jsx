import Navbar from "../../components/navbar/Navbar";
import Featured from "../../components/featured/Featured";
import "./home.scss";
import List from "../../components/list/List";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = ({ type }) => {
  const [lists, setLists] = useState([]);
  const [genre, setGenre] = useState(null);

  useEffect(() => {
    const getRandomLists = async () => {
      try {
        const res = await axios.get(
          `https://backendnetflix-paxc.onrender.com/api/lists${type ? "?type=" + type : ""}${
            genre ? "&genre=" + genre : ""
          }`,
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );
        console.log("Réponse Axios :", res.data); // Vérifiez la réponse de l'API
        setLists(res.data);
      } catch (err) {
        console.error("Erreur lors de la requête Axios :", err);
      }
    };

    getRandomLists();
  }, [type, genre]);

  return (
    <div className="home">
      <Navbar />
      <Featured type={type} setGenre={setGenre} />
      {lists.length > 0 ? (
        lists.map((list) => <List key={list._id} list={list} />)
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Home;
