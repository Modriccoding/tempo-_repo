import React from "react";
import Navbar from "../components/Navbar";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-darker to-spotify-darkest text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto py-16">
        <h1 className="text-5xl font-extrabold mb-8">Bienvenue sur Tempo !</h1>
        <p className="text-xl text-gray-300">
          Ceci est la page d'accueil. Utilise la navigation ci-dessus pour
          explorer l'application.
        </p>
      </main>
    </div>
  );
};

export default Home;
