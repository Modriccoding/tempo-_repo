import { Router } from "express";
import passport from "../config/passport";
import { config } from "../config";
import { Profile as SpotifyProfile } from "passport-spotify";
import { AuthenticateOptions } from "passport";
import { Session } from "express-session";

interface SpotifyUser {
  id: string;
  displayName: string;
  email?: string;
  accessToken: string;
  refreshToken: string;
}

// Extension de la session Express
interface CustomSession extends Session {
  spotifyState?: string;
}

// Extension des options d'authentification pour Spotify
interface SpotifyAuthOptions extends AuthenticateOptions {
  showDialog?: boolean;
}

const router = Router();

// Check authentication status
router.get("/check", (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated() });
});

// Generate Spotify authorization URL
router.get(
  "/spotify",
  passport.authenticate("spotify", {
    scope: [
      "user-read-private",
      "user-read-email",
      "user-top-read",
      "user-read-recently-played",
      "user-read-currently-playing",
      "user-read-playback-state",
    ],
    showDialog: true,
    session: true,
  } as AuthenticateOptions)
);

// Handle Spotify OAuth callback
router.get("/callback", (req, res, next) => {
  console.log("\n=== CALLBACK SPOTIFY REÇU ===");
  console.log("1. Code auth présent:", !!req.query.code);

  if (req.query.error) {
    console.error("❌ ERREUR SPOTIFY:", req.query.error);
    return res.redirect(config.frontend.loginUrl);
  }

  passport.authenticate(
    "spotify",
    {
      session: true,
    } as AuthenticateOptions,
    (
      error: Error | null,
      user: SpotifyUser | false | null,
      info: { message: string } | undefined
    ) => {
      console.log("\n=== PASSPORT AUTHENTICATE CALLBACK ===");
      if (error) {
        console.error("❌ ERREUR AUTHENTIFICATION:", error);
        return res.redirect(config.frontend.loginUrl);
      }

      if (!user) {
        console.error("❌ PAS D'UTILISATEUR RETOURNÉ");
        return res.redirect(config.frontend.loginUrl);
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("❌ ERREUR LOGIN:", loginErr);
          return res.redirect(config.frontend.loginUrl);
        }

        console.log("✅ AUTHENTIFICATION RÉUSSIE");
        console.log("User:", user);
        console.log("Session ID:", req.sessionID);
        return res.redirect(config.frontend.dashboardUrl);
      });
    }
  )(req, res, next);
});

// Debug endpoint
router.get("/debug", (req, res) => {
  console.log("\n=== DEBUG ENDPOINT ===");
  console.log("1. Session ID:", req.sessionID);
  console.log("2. Is Authenticated:", req.isAuthenticated?.());
  console.log("3. User:", req.user);
  console.log("4. Session:", req.session);

  if (!req.isAuthenticated?.()) {
    return res.status(401).json({
      authenticated: false,
      message: "Non authentifié",
    });
  }

  // Si authentifié, renvoyer les infos utilisateur
  res.json({
    authenticated: true,
    user: req.user,
    session: {
      id: req.sessionID,
      cookie: req.session.cookie,
    },
  });
});

router.get("/logout", (req, res) => {
  console.log("Logging out user");
  req.logout(() => {
    req.session.destroy((err) => {
      res.clearCookie("connect.sid", {
        path: "/",
        domain: "tempo.local",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      if (err) {
        console.error("Erreur lors de la destruction de session:", err);
        return res.status(500).json({ success: false, message: "Erreur lors de la déconnexion." });
      }
      return res.json({ success: true });
    });
  });
});

export const authRouter = router;
