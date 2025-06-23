import axios from "axios";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export const getTopArtists = async (
  accessToken: string,
  timeRange: string,
  limit: number
) => {
  try {
    console.log(
      "Appel API Spotify avec token:",
      accessToken.substring(0, 20) + "..."
    );
    const response = await axios.get(
      `${SPOTIFY_API_URL}/me/top/artists?time_range=${timeRange}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Réponse API reçue:", response.status);
    return response.data;
  } catch (error: any) {
    console.error("Erreur détaillée:", {
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getTopTracks = async (
  accessToken: string,
  timeRange: string,
  limit: number
) => {
  try {
    const response = await axios.get(
      `${SPOTIFY_API_URL}/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    throw error;
  }
};

export const getRecentlyPlayed = async (accessToken: string, limit: number) => {
  try {
    const response = await axios.get(
      `${SPOTIFY_API_URL}/me/player/recently-played?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recently played:", error);
    throw error;
  }
};

export const getCurrentPlayback = async (accessToken: string) => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/me/player`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching current playback:", error);
    throw error;
  }
};
