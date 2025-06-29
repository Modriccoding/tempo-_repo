import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Track {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
    name: string;
  };
  artists: { name: string }[];
  duration_ms: number;
}

interface TopTracksProps {
  timeRange: "short_term" | "medium_term" | "long_term";
}

const TopTracks: React.FC<TopTracksProps> = ({ timeRange }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(
          `https://tempo.local:3000/spotify/top-tracks?time_range=${timeRange}&limit=25`,
          { credentials: "include" }
        );
        const data = await response.json();
        setTracks(data.items);
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, [timeRange]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const displayedTracks = showAll ? tracks.slice(0, 25) : tracks.slice(0, 10);

  return (
    <div className="space-y-4">
      {displayedTracks.map((track, index) => (
        <motion.div
          key={track.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center p-4 bg-spotify-dark hover:bg-spotify-light transition-colors rounded-lg"
        >
          <div className="flex-shrink-0 w-12 flex items-center justify-center relative">
            <span
              className="text-white font-extrabold select-none pointer-events-none"
              style={{
                fontSize: "2.8rem",
                lineHeight: 1,
                opacity: 0.13,
                WebkitTextStroke: "2px #fff",
                color: "transparent",
                zIndex: 1,
                fontFamily: "Arial Black, Impact, sans-serif",
                letterSpacing: index + 1 >= 10 ? "-0.2rem" : "0",
                width: "2.8rem",
                textAlign: "center",
                overflow: "visible",
                whiteSpace: "nowrap",
              }}
            >
              {index + 1}
            </span>
          </div>
          <div className="flex-shrink-0 w-16 h-16 relative">
            <img
              src={track.album.images[0]?.url}
              alt={track.album.name}
              className="w-full h-full object-cover rounded relative z-10"
            />
          </div>
          <div className="ml-4 flex-grow">
            <h3 className="text-white font-bold truncate">{track.name}</h3>
            <p className="text-gray-400 text-sm truncate">
              {track.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
          <div className="text-gray-400 text-sm ml-4">
            {formatDuration(track.duration_ms)}
          </div>
        </motion.div>
      ))}
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

export default TopTracks;
