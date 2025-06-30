import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PrivacyModal from "../components/PrivacyModal";

const Profile: React.FC = () => {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    fetch("https://tempo.local:3000/spotify/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setDisplayName(data.display_name);
        setProfileImage(data.images && data.images.length > 0 ? data.images[0].url : null);
      })
      .catch(() => {
        setDisplayName(null);
        setProfileImage(null);
      });
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/auth/logout", { credentials: "include" });
      if (res.ok) {
        window.location.href = "/login";
        window.location.reload();
      } else {
        alert("Échec de la déconnexion.");
      }
    } catch (err) {
      console.error("Erreur de déconnexion :", err);
      alert("Erreur réseau. Vérifie ta connexion ou ton certificat SSL.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-spotify-darker to-spotify-darkest text-white">
      <div className="flex-grow">
        <Navbar />
        <main className="max-w-5xl mx-auto py-16 px-4">
          <h1 className="text-5xl font-extrabold mb-8">Profil</h1>
          {displayName ? (
            <div className="flex items-center gap-4 mb-4">
              {profileImage && (
                <img
                  src={profileImage}
                  alt="Photo de profil Spotify"
                  className="w-16 h-16 rounded-full border-2 border-spotify-green"
                />
              )}
              <span className="text-2xl">
                Connecté en tant que : <span className="font-bold text-spotify-green">{displayName}</span>
              </span>
            </div>
          ) : (
            <p className="text-xl text-gray-300">Chargement du profil...</p>
          )}

          <div className="flex items-center gap-4 mt-8">
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition"
              onClick={() => setShowConfirm(true)}
            >
              Se déconnecter
            </button>
            <button
              className="text-sm text-gray-400 hover:text-white hover:underline"
              onClick={() => setShowPrivacy(true)}
            >
              Règles de confidentialité
            </button>
          </div>

          {/* Popup de confirmation */}
          {showConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
              <div className="bg-spotify-darkest p-8 rounded-lg shadow-lg flex flex-col items-center">
                <p className="mb-6 text-lg">Voulez-vous vraiment vous déconnecter ?</p>
                <div className="flex gap-4">
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-bold"
                    onClick={handleLogout}
                  >
                    Oui, me déconnecter
                  </button>
                  <button
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 font-bold"
                    onClick={() => setShowConfirm(false)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modale de confidentialité */}
          {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;