import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

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

const Home: React.FC = () => {
  const [recentTracks, setRecentTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [topArtist, setTopArtist] = useState<any | null>(null);
  const [topTrack, setTopTrack] = useState<any | null>(null);
  const [topGenre, setTopGenre] = useState<string | null>(null);
  const [genreArtists, setGenreArtists] = useState<any[]>([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch("https://tempo.local:3000/spotify/recently-played", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setRecentTracks(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fetchTopData = async () => {
      setLoadingTop(true);
      try {
        // Top artistes (4 semaines)
        const resArtists = await fetch(
          "https://tempo.local:3000/spotify/top-artists?time_range=short_term&limit=10",
          { credentials: "include" }
        );
        const dataArtists = await resArtists.json();
        setTopArtist(dataArtists.items[0]);
        // Genre préféré (comme sur Stats)
        const allGenres = dataArtists.items.flatMap((a: any) => a.genres || []);
        const mostFrequentGenre = getMostFrequent(allGenres);
        setTopGenre(mostFrequentGenre);

        // Récupérer les artistes du genre préféré pour la mosaïque
        if (mostFrequentGenre) {
          const genreArtistsList = dataArtists.items
            .filter(
              (artist: any) =>
                artist.genres && artist.genres.includes(mostFrequentGenre)
            )
            .slice(0, 6); // Prendre max 6 artistes pour la mosaïque
          setGenreArtists(genreArtistsList);
        }

        // Top titres (4 semaines)
        const resTracks = await fetch(
          "https://tempo.local:3000/spotify/top-tracks?time_range=short_term&limit=10",
          { credentials: "include" }
        );
        const dataTracks = await resTracks.json();
        setTopTrack(dataTracks.items[0]);
      } catch (e) {
        setTopArtist(null);
        setTopTrack(null);
        setTopGenre(null);
        setGenreArtists([]);
      } finally {
        setLoadingTop(false);
      }
    };
    fetchTopData();
  }, []);

  const handleNavigateToArtists = () => {
    navigate("/stats#top-artists");
  };

  const handleNavigateToTracks = () => {
    navigate("/stats#top-tracks");
  };

  const handleNavigateToGenres = () => {
    navigate("/stats#top-genres");
  };

  const tracksToShow = recentTracks.length > 0 ? [...recentTracks.slice(0, 10), ...recentTracks.slice(0, 10)] : [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-spotify-darker to-spotify-darkest text-white">
      <div className="flex-grow">
        <Navbar />
        <main className="max-w-5xl mx-auto py-16 px-4">
          <h1 className="text-5xl font-extrabold mb-8">Bienvenue sur Tempo !</h1>
          <p className="text-xl text-gray-300 mb-8">
            Ceci est la page d'accueil. Utilise la navigation ci-dessus pour
            explorer l'application.
          </p>
          {/* Top 1 artiste, top 1 titre, genre préféré */}
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            {/* Top 1 artiste */}
            <div className="flex-1 bg-spotify-dark rounded-lg p-6 flex flex-col items-center shadow-lg min-w-[220px] max-w-xs mx-auto relative overflow-hidden min-h-[270px]">
              <h3 className="text-white font-bold text-lg text-center mb-4 w-full">
                Artiste préféré(e) du moment
              </h3>
              {loadingTop ? (
                <div className="text-gray-400">Chargement...</div>
              ) : topArtist ? (
                <>
                  <img
                    src={topArtist.images[0]?.url}
                    alt={topArtist.name}
                    className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-spotify-darkest shadow"
                    style={{ background: "#181818" }}
                  />
                  <h3 className="text-white font-bold text-lg text-center mb-1 w-full truncate">
                    {topArtist.name}
                  </h3>
                  <p className="text-gray-300 text-sm text-center w-full truncate">
                    {topArtist.genres.slice(0, 2).join(", ") || "Genre inconnu"}
                  </p>
                  <button
                    onClick={handleNavigateToArtists}
                    className="text-spotify-green hover:text-spotify-green-light text-sm mt-2 underline cursor-pointer transition-colors"
                  >
                    Voir mes artistes préféré(e)s
                  </button>
                </>
              ) : (
                <div className="text-gray-400">Aucun artiste trouvé</div>
              )}
            </div>
            {/* Top 1 titre */}
            <div className="flex-1 bg-spotify-dark rounded-lg p-6 flex flex-col items-center shadow-lg min-w-[220px] max-w-xs mx-auto relative overflow-hidden min-h-[270px]">
              <h3 className="text-white font-bold text-lg text-center mb-4 w-full">
                Musique préférée du moment
              </h3>
              {loadingTop ? (
                <div className="text-gray-400">Chargement...</div>
              ) : topTrack ? (
                <>
                  <img
                    src={topTrack.album.images[0]?.url}
                    alt={topTrack.name}
                    className="w-32 h-32 object-cover rounded mb-4 border-4 border-spotify-darkest shadow"
                    style={{ background: "#181818" }}
                  />
                  <h3 className="text-white font-bold text-lg text-center mb-1 w-full truncate">
                    {topTrack.name}
                  </h3>
                  <p className="text-gray-300 text-sm text-center w-full truncate">
                    {topTrack.artists.map((a: any) => a.name).join(", ")}
                  </p>
                  <button
                    onClick={handleNavigateToTracks}
                    className="text-spotify-green hover:text-spotify-green-light text-sm mt-2 underline cursor-pointer transition-colors"
                  >
                    Voir mes musiques préférées
                  </button>
                </>
              ) : (
                <div className="text-gray-400">Aucun titre trouvé</div>
              )}
            </div>
            {/* Genre préféré */}
            <div className="flex-1 bg-spotify-dark rounded-lg p-6 flex flex-col items-center shadow-lg min-w-[220px] max-w-xs mx-auto relative overflow-hidden min-h-[270px]">
              <h3 className="text-white font-bold text-lg text-center mb-4 w-full">
                Genre préféré
              </h3>
              {loadingTop ? (
                <div className="text-gray-400">Chargement...</div>
              ) : topGenre ? (
                <>
                  <p className="text-spotify-green text-xl text-center w-full truncate font-extrabold mb-4">
                    {topGenre}
                  </p>
                  {/* Mosaïque d'artistes */}
                  <div className="grid grid-cols-3 gap-2 mb-4 w-full px-4 justify-items-center">
                    {genreArtists.slice(0, 9).map((artist, idx) => (
                      <img
                        key={idx}
                        src={artist.images[0]?.url}
                        alt={artist.name}
                        className="w-12 h-12 object-cover rounded-full border border-spotify-darkest"
                        style={{ background: "#181818" }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleNavigateToGenres}
                    className="text-spotify-green hover:text-spotify-green-light text-sm mt-2 underline cursor-pointer transition-colors"
                  >
                    Voir mes genres préférés
                  </button>
                </>
              ) : (
                <div className="text-gray-400">Aucun genre trouvé</div>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Morceaux récemment joués</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : recentTracks.length === 0 ? (
            <p>Aucun morceau récemment joué trouvé.</p>
          ) : (
            <div 
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div ref={scrollContainerRef} className="overflow-x-hidden w-full">
                <div
                  className={`flex gap-8 ${isPaused ? 'animate-none' : 'animate-marquee'}`}
                  style={{
                    width: "max-content",
                    animation: isPaused ? 'none' : "marquee 30s linear infinite",
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
              <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-10 transition">
                <ChevronLeftIcon className="h-6 w-6 text-white" />
              </button>
              <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-10 transition">
                <ChevronRightIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
