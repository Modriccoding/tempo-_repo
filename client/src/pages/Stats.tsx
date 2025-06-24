import React, { useState } from "react";
import Navbar from "../components/Navbar";
import TopArtists from "../components/Stats/TopArtists";
import TopTracks from "../components/Stats/TopTracks";

type TimeRange = "short_term" | "medium_term" | "long_term";

const Stats: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");
  const [testMessage, setTestMessage] = useState<string>("");

  const timeRangeLabels = {
    short_term: "4 semaines",
    medium_term: "6 mois",
    long_term: "Tout le temps",
  };

  const testTopArtists = async () => {
    try {
      setTestMessage("Test en cours...");
      const response = await fetch(
        "https://localhost:3000/api/spotify/test-top-artists",
        {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTestMessage("Test réussi ! Vérifiez la console du serveur.");
      console.log("Réponse du serveur:", data);
    } catch (error) {
      setTestMessage(
        `Erreur: ${
          error instanceof Error ? error.message : "Une erreur est survenue"
        }`
      );
      console.error("Erreur lors du test:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-darker to-spotify-darkest p-8">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Vos statistiques d'écoute
          </h1>
          <button
            onClick={testTopArtists}
            className="bg-spotify-green text-black px-4 py-2 rounded-full font-medium hover:scale-105 transition-transform"
          >
            Tester l'accès aux données
          </button>
        </div>

        {testMessage && (
          <div
            className={`mb-4 p-4 rounded ${
              testMessage.includes("Erreur")
                ? "bg-red-500/20"
                : "bg-green-500/20"
            }`}
          >
            {testMessage}
          </div>
        )}

        {/* Time Range Selector */}
        <div className="flex gap-4 mb-8">
          {Object.entries(timeRangeLabels).map(([range, label]) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as TimeRange)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-spotify-green text-black"
                  : "bg-spotify-light text-white hover:bg-spotify-green hover:text-black"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stats Sections */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              Vos artistes préférés
            </h2>
            <TopArtists timeRange={timeRange} />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              Vos titres préférés
            </h2>
            <TopTracks timeRange={timeRange} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Stats;
