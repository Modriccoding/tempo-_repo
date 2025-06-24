import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Stats from "./pages/Stats";
import Home from "./pages/Home";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "https://tempo.local:3000/auth/check",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (err) {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          err
        );
        setError("Erreur de connexion au serveur");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    console.log("Redirection vers l'authentification Spotify...");
    window.location.href = "https://tempo.local:3000/auth/spotify";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotify-darkest text-white flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-spotify-darkest text-white flex flex-col items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl mb-2">Erreur de connexion au serveur</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-spotify-green text-black font-bold py-2 px-4 rounded-full"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            console.log("Login route – isAuthenticated =", isAuthenticated);
      return isAuthenticated ? (
              <Navigate to="/Home" replace />
            ) : (
              <div className="min-h-screen bg-spotify-darkest text-white flex items-center justify-center">
                <button
                  onClick={handleLogin}
                  className="bg-spotify-green text-black font-bold py-4 px-8 rounded-full hover:scale-105 transition-transform"
                >
                  Se connecter avec Spotify
                </button>
              </div>
            )
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated === false ? (
              <Navigate to="/login" replace />
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/stats"
          element={
            isAuthenticated === false ? (
              <Navigate to="/login" replace />
            ) : (
              <Stats />
            )
          }
        />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
