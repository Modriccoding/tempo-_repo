import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-spotify-darker text-gray-400 py-6 mt-auto border-t border-gray-800">
      <div className="max-w-5xl mx-auto px-8 text-center">
        <p>&copy; {new Date().getFullYear()} Tempo. Tous droits réservés.</p>
        <p className="text-sm mt-2">
          Propulsé avec passion et l'
          <a
            href="https://developer.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-spotify-green hover:underline ml-1"
          >
            API Spotify
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer; 