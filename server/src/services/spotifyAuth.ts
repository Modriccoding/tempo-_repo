import axios from "axios";
import { config } from "../config";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export const generateSpotifyAuthUrl = () => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "user-read-recently-played",
    "user-read-currently-playing",
    "user-read-playback-state",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: config.spotify.clientId,
    response_type: "code",
    redirect_uri: config.spotify.redirectUri,
    scope: scopes,
    show_dialog: "true",
  });

  return `${SPOTIFY_AUTH_URL}/authorize?${params.toString()}`;
};

export const handleSpotifyCallback = async (code: string) => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: config.spotify.redirectUri,
  });

  try {
    const response = await axios.post(
      `${SPOTIFY_AUTH_URL}/api/token`,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${config.spotify.clientId}:${config.spotify.clientSecret}`
          ).toString("base64")}`,
        },
      }
    );

    console.log("Token response:", {
      access_token: response.data.access_token ? "Set" : "Not set",
      refresh_token: response.data.refresh_token ? "Set" : "Not set",
      expires_in: response.data.expires_in,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error in handleSpotifyCallback:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const refreshSpotifyToken = async (refreshToken: string) => {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  try {
    const response = await axios.post(
      `${SPOTIFY_AUTH_URL}/api/token`,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${config.spotify.clientId}:${config.spotify.clientSecret}`
          ).toString("base64")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in refreshSpotifyToken:",
      error.response?.data || error.message
    );
    throw error;
  }
};
