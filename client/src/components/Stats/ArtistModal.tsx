import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Le type Artist complet que l'API Spotify peut retourner
export interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
  followers: { total: number };
  popularity: number;
  external_urls: { spotify: string };
}

interface ArtistModalProps {
  artist: Artist | null;
  onClose: () => void;
}

const ArtistModal: React.FC<ArtistModalProps> = ({ artist, onClose }) => {
  const formatFollowers = (count: number) => {
    return new Intl.NumberFormat('fr-FR').format(count);
  };

  return (
    <AnimatePresence>
      {artist && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-spotify-dark p-8 rounded-lg shadow-2xl max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-3xl font-light leading-none"
              aria-label="Fermer"
            >
              &times;
            </button>
            <div className="text-center">
              {artist.images[0] && (
                <img
                  src={artist.images[0].url}
                  alt={`Photo de ${artist.name}`}
                  className="w-40 h-40 rounded-full mx-auto mb-6 border-4 border-spotify-light shadow-lg"
                />
              )}
              <h2 className="text-4xl font-bold text-white mb-2">{artist.name}</h2>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {artist.genres.slice(0, 4).map((genre) => (
                  <span key={genre} className="bg-spotify-light text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-center mb-8">
                <div>
                  <div className="text-2xl font-bold text-spotify-green">{formatFollowers(artist.followers.total)}</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-spotify-green">{artist.popularity}/100</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Popularité</div>
                </div>
              </div>

              <a
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-spotify-green text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
              >
                Voir sur Spotify
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ArtistModal; 