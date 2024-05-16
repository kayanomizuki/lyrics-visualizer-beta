export const ROOT: string = (() => {
  if (process.env.NODE_ENV === "production") {
    return "https://lyrics-visualizer-beta.vercel.app";
  } else if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  } else {
    return "http://localhost:3000";
  }
})();

export const SPOTIFY_SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-email",
] as const;

export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";

export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";

export const SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize";

export const SPOTIFY_API_TOKEN_URL = "https://accounts.spotify.com/api/token";

export const SPOTIFY_REDIRECT_URI = `${ROOT}/player`;

export const MUSIXMATCH_LYRICS_API_URL =
  process.env.MUSIXMATCH_LYRICS_API_URL || "";

export const LOCAL_API_SPOTIFY_ACCESS_TOKEN_URL = `${ROOT}/api/spotify/accessToken`;

export const LOCAL_API_SPOTIFY_REFRESHED_ACCESS_TOKEN_URL = `${ROOT}/api/spotify/refreshedAccessToken`;

export const LOCAL_API_MUSIXMATCH_LYRICS_API_URL = `${ROOT}/api/musixmatch/lyrics`;
