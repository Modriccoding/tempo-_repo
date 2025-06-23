import { useState } from "react";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Redirect to Spotify auth endpoint with correct port
    window.location.href = "https://localhost:3000/auth/spotify";
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Tempo</h1>
        <p>Your Spotify Analytics Dashboard</p>
      </header>

      <main className="app-main">
        {!isLoggedIn ? (
          <div className="login-container">
            <h2>Welcome to Tempo</h2>
            <p>Connect with your Spotify account to see your music analytics</p>
            <button onClick={handleLogin} className="login-button">
              Connect with Spotify
            </button>
          </div>
        ) : (
          <div className="dashboard-container">
            <nav className="dashboard-nav">
              <button>Top Artists</button>
              <button>Top Tracks</button>
              <button>Recently Played</button>
              <button>Now Playing</button>
            </nav>
            <div className="dashboard-content">
              {/* Content will be added here */}
              <p>Select a category to view your stats</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
