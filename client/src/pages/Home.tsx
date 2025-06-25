import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Home: React.FC = () => {
  const [recentTracks, setRecentTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://tempo.local:3000/spotify/recently-played", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setRecentTracks(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Duplique la liste pour l'effet boucle
  const tracksToShow = [...recentTracks.slice(0, 10), ...recentTracks.slice(0, 10)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-darker to-spotify-darkest text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto py-16">
        <h1 className="text-5xl font-extrabold mb-8">Bienvenue sur Tempo !</h1>
        <p className="text-xl text-gray-300 mb-8">
          Ceci est la page d'accueil. Utilise la navigation ci-dessus pour explorer l'application.
        </p>
        <h2 className="text-2xl font-bold mb-4">Morceaux récemment joués</h2>
        {loading ? (
          <p>Chargement...</p>
        ) : recentTracks.length === 0 ? (
          <p>Aucun morceau récemment joué trouvé.</p>
        ) : (
          <div className="overflow-x-hidden w-full">
            <div
              className="flex gap-8 animate-marquee"
              style={{
                width: "max-content",
                animation: "marquee 30s linear infinite",
              }}
            >
              {tracksToShow.map((trackObj, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-spotify-dark p-2 rounded min-w-[180px] max-w-[200px]"
                >
                  <img
                    src={trackObj.track.album.images[2]?.url || trackObj.track.album.images[0]?.url}
                    alt={trackObj.track.name}
                    className="w-16 h-16 rounded mb-2"
                  />
                  <div className="font-bold text-center truncate w-full">{trackObj.track.name}</div>
                  <div className="text-gray-400 text-sm text-center truncate w-full">
                    {trackObj.track.artists.map((a: any) => a.name).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: fit-content;
            min-width: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default Home;