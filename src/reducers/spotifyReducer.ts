import { CurrentlyPlayingContext } from "spotify-web-api-ts/types/types/SpotifyObjects";

export type SpotifyState = {
  isConnected: boolean;
  isStandby: boolean;
  trackId: string | undefined;
  trackUrl: string | undefined;
  trackName: string | undefined;
  artistName: string | undefined;
  albumName: string | undefined;
  albumImageUrl: string | undefined;
  trackDuration: number;
  trackProgress: number;
  trackProgressMs: number;
  isPlaying: boolean;
};

export type SpotifyAction =
  | {
      type: "UPDATE_STATE";
      spotifyPlaybackInfo: CurrentlyPlayingContext | null;
    }
  | { type: "SET_IS_CONNECTED"; isConnected: boolean }
  | { type: "SET_IS_STANDBY"; isStandby: boolean }
  | { type: "UPDATE_TRACK_PROGRESS_MS"; addition: number };

export const initialSpotifyState: SpotifyState = {
  isConnected: false,
  isStandby: false,
  trackId: undefined,
  trackUrl: undefined,
  trackName: undefined,
  artistName: undefined,
  albumName: undefined,
  albumImageUrl: undefined,
  trackDuration: 0,
  trackProgress: 0,
  trackProgressMs: 0,
  isPlaying: false,
};

export const spotifyReducer = function (
  state: SpotifyState,
  action: SpotifyAction
): SpotifyState {
  switch (action.type) {
    case "UPDATE_STATE":
      let newState: SpotifyState = {
        ...initialSpotifyState,
        isConnected: state.isConnected,
        isStandby: state.isStandby,
      };
      if (action.spotifyPlaybackInfo !== null) {
        newState.trackId = action.spotifyPlaybackInfo.item?.id;
        newState.trackUrl =
          action.spotifyPlaybackInfo.item?.external_urls.spotify;
        newState.trackName = action.spotifyPlaybackInfo.item?.name;
        newState.artistName = action.spotifyPlaybackInfo.item?.artists[0].name;
        newState.albumName = action.spotifyPlaybackInfo.item?.album.name;
        newState.albumImageUrl =
          action.spotifyPlaybackInfo.item?.album.images[0]?.url;
        newState.trackDuration =
          action.spotifyPlaybackInfo.item?.duration_ms || 0;
        newState.trackProgress = action.spotifyPlaybackInfo.progress_ms || 0;
        newState.trackProgressMs = action.spotifyPlaybackInfo.progress_ms || 0;
        newState.isPlaying = action.spotifyPlaybackInfo.is_playing || false;
      }
      return newState;
    case "SET_IS_CONNECTED":
      return { ...state, isConnected: action.isConnected };
    case "SET_IS_STANDBY":
      return { ...state, isStandby: action.isStandby };
    case "UPDATE_TRACK_PROGRESS_MS":
      return {
        ...state,
        trackProgressMs: state.trackProgressMs + action.addition,
      };
    default:
      throw new Error("Unknown action type");
  }
};
