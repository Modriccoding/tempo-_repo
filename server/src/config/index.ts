import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: 3000,
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
  },
  spotify: {
    clientId: process.env.spotify_client_id || "",
    clientSecret: process.env.spotify_client_secret || "",
    redirectUri: process.env.spotify_redirect_uri || "https://localhost:3000/auth/callback",
  },
} as const;
