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

const TopArtists: React.FC<TopArtistsProps> = ({ timeRange }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const response = await fetch(
          `https://localhost:3000/api/spotify/top-artists?time_range=${timeRange}&limit=10`,
          { credentials: "include" }
        );
        const data = await response.json();
        setArtists(data.items);
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

  return (
    <div>
      <div style={{ color: "lime", fontWeight: "bold", marginBottom: "1rem" }}>
        test okay
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {artists.map((artist, index) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-spotify-dark p-4 rounded-lg hover:bg-spotify-light transition-colors"
          >
            <div className="relative pb-[100%] mb-4">
              <img
                src={artist.images[0]?.url}
                alt={artist.name}
                className="absolute inset-0 w-full h-full object-cover rounded-full"
              />
            </div>
            <h3 className="text-white font-bold truncate">{artist.name}</h3>
            <p className="text-gray-400 text-sm">
              {artist.genres.slice(0, 2).join(", ")}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopArtists;
