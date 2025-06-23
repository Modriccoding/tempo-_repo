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

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(
          `https://localhost:3000/api/spotify/top-tracks?time_range=${timeRange}&limit=10`,
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

  return (
    <div className="space-y-4">
      {tracks.map((track, index) => (
        <motion.div
          key={track.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center p-4 bg-spotify-dark hover:bg-spotify-light transition-colors rounded-lg"
        >
          <div className="flex-shrink-0 w-16 h-16">
            <img
              src={track.album.images[0]?.url}
              alt={track.album.name}
              className="w-full h-full object-cover rounded"
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
    </div>
  );
};

export default TopTracks;
