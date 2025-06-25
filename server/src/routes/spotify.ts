import { Router, Request, Response, NextFunction } from "express";
import {
  getTopArtists,
  getTopTracks,
  getRecentlyPlayed,
  getCurrentPlayback,
} from "../services/spotifyApi";
import axios from "axios";

const router = Router();

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    displayName: string;
    email?: string;
    accessToken: string;
    refreshToken: string;
  };
}

interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
}

interface SpotifyTopArtistsResponse {
  items: SpotifyArtist[];
  total: number;
  limit: number;
  offset: number;
  href: string;
}

// Middleware to ensure user is authenticated
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  console.log("\n=== VÉRIFICATION AUTHENTIFICATION ===");
  console.log("URL demandée:", req.url);
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);
  console.log("Is Authenticated:", req.isAuthenticated?.());

  if (!req.isAuthenticated?.()) {
    console.log("❌ ERREUR: Utilisateur non authentifié");
    return res.status(401).json({
      error: "Non authentifié",
      message: "Veuillez vous reconnecter",
      redirectTo: "/login",
    });
  }

  const user = req.user as AuthenticatedRequest["user"];
  if (!user || !user.accessToken) {
    console.log("❌ ERREUR: Données utilisateur invalides");
    console.log("User:", user);
    return res.status(401).json({
      error: "Session invalide",
      message: "Session expirée, veuillez vous reconnecter",
      redirectTo: "/login",
    });
  }

  console.log("✅ Authentification validée");
  console.log("User ID:", user.id);
  next();
};

router.use(authenticateToken);

// Get user's top artists
router.get("/top-artists", async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedRequest["user"];
    const { time_range = "medium_term", limit = 50 } = req.query;
    const artists = await getTopArtists(
      user.accessToken,
      time_range as string,
      Number(limit)
    );
    res.json(artists);
  } catch (error) {
    console.error("Error fetching top artists:", error);
    res.status(500).json({ error: "Failed to fetch top artists" });
  }
});

// Get user's top tracks
router.get("/top-tracks", async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedRequest["user"];
    const { time_range = "medium_term", limit = 50 } = req.query;
    const tracks = await getTopTracks(
      user.accessToken,
      time_range as string,
      Number(limit)
    );
    res.json(tracks);
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    res.status(500).json({ error: "Failed to fetch top tracks" });
  }
});

// Get user's recently played tracks
router.get("/recently-played", async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedRequest["user"];
    const { limit = 50 } = req.query;
    const tracks = await getRecentlyPlayed(user.accessToken, Number(limit));
    res.json(tracks);
  } catch (error) {
    console.error("Error fetching recently played:", error);
    res.status(500).json({ error: "Failed to fetch recently played tracks" });
  }
});

// Get user's current playback
router.get("/current-playback", async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedRequest["user"];
    const playback = await getCurrentPlayback(user.accessToken);
    res.json(playback);
  } catch (error) {
    console.error("Error fetching current playback:", error);
    res.status(500).json({ error: "Failed to fetch current playback" });
  }
});

// Route de test pour les top artistes
router.get("/test-top-artists", async (req, res) => {
  try {
    console.log("\n=== TEST TOP ARTISTES ===");
    console.log("Session ID:", req.sessionID);
    console.log("Is Authenticated:", req.isAuthenticated?.());
    console.log("Session:", req.session);
    console.log("User:", req.user);

    const user = req.user as any;

    if (!user || !user.accessToken) {
      console.log("❌ Pas d'utilisateur ou de token");
      return res.status(401).json({ error: "Non authentifié" });
    }

    console.log("\n1. Récupération des top artistes...");
    console.log("Access Token:", user.accessToken.substring(0, 20) + "...");
    const artists = await getTopArtists(user.accessToken, "medium_term", 10);

    console.log("\n🎵 VOS TOP 10 ARTISTES 🎵");
    console.log("---------------------------");
    artists.items.forEach((artist: any, index: number) => {
      console.log(`${index + 1}. ${artist.name}`);
      console.log(`   Genres: ${artist.genres.join(", ")}`);
      console.log(`   Popularité: ${artist.popularity}/100`);
      console.log("---------------------------");
    });

    res.json({
      success: true,
      message: "Vérifiez les logs du serveur pour voir vos top artistes",
    });
  } catch (error) {
    console.error("❌ Erreur test top artistes:", error);
    res.status(500).json({ error: "Failed to fetch top artists" });
  }
});

// Route pour récupérer le profil Spotify de l'utilisateur connecté
router.get("/me", async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedRequest["user"];
    if (!user || !user.accessToken) {
      return res.status(401).json({ error: "Non authentifié" });
    }
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil Spotify:", error);
    res.status(500).json({ error: "Impossible de récupérer le profil Spotify" });
  }
});

export const spotifyRouter = router;
