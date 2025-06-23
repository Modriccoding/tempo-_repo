import { useState } from "react";
import TopTracks from "./TopTracks";
import TopArtists from "./TopArtists";

const Stats = () => {
  const [activeTab, setActiveTab] = useState<"tracks" | "artists">("tracks");
  const [timeRange] = useState<"short_term" | "medium_term" | "long_term">(
    "medium_term"
  );

  return (
    <div className="min-h-screen bg-spotify-darkest text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Vos statistiques Spotify</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("tracks")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              activeTab === "tracks"
                ? "bg-spotify-green text-black"
                : "bg-spotify-dark text-white hover:bg-spotify-light"
            }`}
          >
            Top Titres
          </button>
          <button
            onClick={() => setActiveTab("artists")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              activeTab === "artists"
                ? "bg-spotify-green text-black"
                : "bg-spotify-dark text-white hover:bg-spotify-light"
            }`}
          >
            Top Artistes
          </button>
        </div>

        {activeTab === "tracks" ? (
          <TopTracks timeRange={timeRange} />
        ) : (
          <TopArtists timeRange={timeRange} />
        )}
      </div>
    </div>
  );
};

export default Stats;
