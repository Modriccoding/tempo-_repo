import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import { config } from "../config";
import session from "express-session";

// Étendre la session Express pour inclure notre utilisateur
declare module "express-session" {
  interface SessionData {
    spotifyUser: SpotifyUser;
  }
}

// Store de session global
let sessionStore: session.MemoryStore;

export const setSessionStore = (store: session.MemoryStore) => {
  sessionStore = store;
};

console.log("\n=== CONFIGURATION PASSPORT ===");
console.log("1. Configuration Spotify:", {
  clientId: config.spotify.clientId,
  redirectUri: config.spotify.redirectUri,
  scopes: [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "user-read-recently-played",
    "user-read-currently-playing",
    "user-read-playback-state",
  ],
});

interface SpotifyUser {
  id: string;
  displayName: string;
  email?: string;
  accessToken: string;
  refreshToken: string;
}

// Étendre le type User de Passport
declare global {
  namespace Express {
    interface User extends SpotifyUser {}
  }
}

// Serialize just the user
passport.serializeUser((user: SpotifyUser, done) => {
  console.log("\n=== SÉRIALISATION UTILISATEUR ===");
  console.log("Sérialisation de l'utilisateur:", user.id);
  done(null, user);
});

// Deserialize by returning the stored user
passport.deserializeUser((user: SpotifyUser, done) => {
  console.log("\n=== DÉSÉRIALISATION UTILISATEUR ===");
  console.log("Désérialisation de l'utilisateur:", user.id);
  done(null, user);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: config.spotify.clientId,
      clientSecret: config.spotify.clientSecret,
      callbackURL: config.spotify.redirectUri,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, expires_in, profile, done) => {
      try {
        console.log("\n=== STRATÉGIE SPOTIFY CALLBACK ===");
        console.log("1. Profile:", {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value,
        });
        console.log("2. Tokens:", {
          accessToken: accessToken ? "Présent" : "Manquant",
          refreshToken: refreshToken ? "Présent" : "Manquant",
          expires_in,
        });

        const user: SpotifyUser = {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value,
          accessToken,
          refreshToken,
        };

        console.log("4. User créé et sauvegardé avec succès");
        return done(null, user);
      } catch (error) {
        console.error("❌ ERREUR CRÉATION USER:", error);
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;
