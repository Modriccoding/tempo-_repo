import React, { useEffect, useState } from "react";

interface TopGenresProps {
  timeRange: string;
}

const getMostFrequent = (arr: string[]) => {
  const freq: Record<string, number> = {};
  arr.forEach((g) => (freq[g] = (freq[g] || 0) + 1));
  return Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([genre]) => genre);
};

const TopGenres: React.FC<TopGenresProps> = ({ timeRange }) => {
  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [genreArtists, setGenreArtists] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopGenres = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://tempo.local:3000/spotify/top-artists?time_range=${timeRange}&limit=20`,
          { credentials: "include" }
        );
        const data = await response.json();
        const allGenres = data.items.flatMap(
          (artist: any) => artist.genres || []
        );
        const top3Genres = getMostFrequent(allGenres);
        setTopGenres(top3Genres);
        // Pour chaque genre, trouver 2-3 artistes du genre
        const genreArtistsMap: Record<string, any[]> = {};
        top3Genres.forEach((genre) => {
          genreArtistsMap[genre] = data.items
            .filter(
              (artist: any) => artist.genres && artist.genres.includes(genre)
            )
            .slice(0, 3);
        });
        setGenreArtists(genreArtistsMap);
      } catch (error) {
        console.error("Erreur lors du chargement des genres:", error);
        setTopGenres([]);
        setGenreArtists({});
      } finally {
        setLoading(false);
      }
    };
    fetchTopGenres();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-spotify-dark rounded-lg p-6 flex items-center relative overflow-hidden min-h-[100px]"
          >
            <div className="text-gray-400">Chargement...</div>
          </div>
        ))}
      </div>
    );
  }

  if (topGenres.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">Aucun genre trouvé</div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {topGenres.map((genre, index) => (
        <div
          key={genre}
          className="bg-spotify-dark rounded-lg p-4 flex flex-col relative overflow-hidden min-h-[100px]"
        >
          <span
            className="absolute left-4 top-4 text-white font-extrabold select-none pointer-events-none"
            style={{
              fontSize: "2.5rem",
              lineHeight: 1,
              opacity: 0.1,
              WebkitTextStroke: "2px #fff",
              color: "transparent",
              zIndex: 1,
              fontFamily: "Arial Black, Impact, sans-serif",
            }}
          >
            {index + 1}
          </span>
          <div className="relative z-10 flex flex-col gap-2 pl-12">
            <h3 className="text-white font-bold text-lg mb-1">{genre}</h3>
            <p className="text-gray-300 text-xs mb-2">
              {index === 0
                ? "Genre le plus écouté"
                : index === 1
                ? "Deuxième genre préféré"
                : "Troisième genre préféré"}
            </p>
            <div className="flex gap-2 mt-1">
              {genreArtists[genre]?.map((artist, i) => (
                <img
                  key={i}
                  src={artist.images[0]?.url}
                  alt={artist.name}
                  className="w-10 h-10 object-cover rounded-full border border-spotify-darkest"
                  style={{ background: "#181818" }}
                  title={artist.name}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopGenres;
