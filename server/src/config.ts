import dotenv from "dotenv";

dotenv.config();

// Configuration avec un nom de domaine local
const SPOTIFY_REDIRECT_URI = "https://tempo.local:3000/auth/callback";
const FRONTEND_URL = "https://tempo.local:5174";

export const config = {
  port: 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  spotify: {
    clientId: "ba3a4263c89c458988ac1b2c25bbed14",
    clientSecret: "0073c450d26e40689a9da2903f1e1cfe",
    redirectUri: SPOTIFY_REDIRECT_URI,
  },
  frontend: {
    url: FRONTEND_URL,
    loginUrl: `${FRONTEND_URL}/login`,
    dashboardUrl: `${FRONTEND_URL}/stats`,
  },
  session: {
    secret: "your-secret-key",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: "tempo.local",
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
} as const;
