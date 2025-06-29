import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
  popularity: number;
}

interface TopArtistsProps {
  timeRange: "short_term" | "medium_term" | "long_term";
}

const getMostFrequent = (arr: string[]) => {
  const freq: Record<string, number> = {};
  arr.forEach((g) => (freq[g] = (freq[g] || 0) + 1));
  let max = 0;
  let genre = "";
  for (const g in freq) {
    if (freq[g] > max) {
      max = freq[g];
      genre = g;
    }
  }
  return genre;
};

const TopArtists: React.FC<TopArtistsProps> = ({ timeRange }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [topGenre, setTopGenre] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const response = await fetch(
          `https://tempo.local:3000/spotify/top-artists?time_range=${timeRange}&limit=25`,
          { credentials: "include" }
        );
        const data = await response.json();
        setArtists(data.items);
        // Calcule le genre le plus fréquent
        const allGenres = data.items.flatMap((a: any) => a.genres || []);
        setTopGenre(getMostFrequent(allGenres));
      } catch (error) {
        console.error("Error fetching top artists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, [timeRange]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const displayedArtists = showAll
    ? artists.slice(0, 25)
    : artists.slice(0, 10);

  return (
    <div>
      {/* Genre le plus fréquent */}
      {topGenre && (
        <div className="mb-6 text-left">
          <div className="inline-block bg-spotify-dark rounded-lg p-4 shadow text-spotify-green font-bold text-lg">
            Genre le plus récurrent : {topGenre}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {displayedArtists.map((artist, index) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative bg-spotify-dark rounded-lg flex flex-col items-center shadow-lg overflow-hidden min-h-[270px]"
          >
            {/* Numéro Netflix-style, bien visible pour 10+ */}
            <span
              className="absolute left-2 top-2 text-white font-extrabold select-none pointer-events-none"
              style={{
                fontSize: "7rem",
                lineHeight: 1,
                opacity: 0.08,
                WebkitTextStroke: "3px #fff",
                color: "transparent",
                zIndex: 1,
                fontFamily: "Arial Black, Impact, sans-serif",
                letterSpacing: index + 1 >= 10 ? "-0.2rem" : "0",
                width: "7.5rem",
                textAlign: "left",
                overflow: "visible",
                whiteSpace: "pre-line",
              }}
            >
              {index + 1 < 10
                ? index + 1
                : `${String(index + 1)[0]}\n${String(index + 1)[1]}`}
            </span>
            {/* Image */}
            <div className="relative z-10 flex flex-col items-center w-full pt-4">
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-spotify-darkest shadow"
                style={{ background: "#181818" }}
              />
              {/* Nom */}
              <h3 className="text-white font-bold text-lg text-center mb-1 w-full truncate">
                {artist.name}
              </h3>
              {/* Genres */}
              <p className="text-gray-300 text-sm text-center w-full truncate">
                {artist.genres.slice(0, 2).join(", ") || "Genre inconnu"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="w-full flex justify-center mt-6">
        <button
          className="text-xs px-4 py-2 rounded-full bg-spotify-light text-white hover:bg-spotify-green hover:text-black transition font-semibold"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "Afficher moins" : "Afficher plus"}
        </button>
      </div>
    </div>
  );
};

export default TopArtists;
