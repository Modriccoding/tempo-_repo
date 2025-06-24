import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("[DEBUG] Composant Home monté : vous êtes sur la page Home");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-spotify-darkest text-white">
      <h1 className="text-4xl font-bold">Bienvenue sur TEMPO !</h1>
      <p className="mt-4 text-lg">Vous êtes connecté. Profitez de l'application !</p>
      <button
        className="mt-8 bg-spotify-green text-black font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform"
        onClick={() => {
          console.log("[DEBUG] Bouton 'Voir mes statistiques' cliqué");
          navigate("/stats");
        }}
      >
        Voir mes statistiques
      </button>
    </div>
  );
};

export default Home;
