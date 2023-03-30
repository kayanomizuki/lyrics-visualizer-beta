import { LyricsObject } from "../types/type";

export type LyricsState = {
  isLoading: boolean;
  sourceExists: boolean;
  source: LyricsObject | undefined;
  isLineSynced: boolean;
};

export type LyricsAction =
  | { type: "SET_IS_LOADING"; isLoading: boolean }
  | { type: "SET_SOURCE"; source: LyricsObject | undefined };

export const initiallyricsState: LyricsState = {
  isLoading: false,
  sourceExists: false,
  source: undefined,
  isLineSynced: false,
};

export const lyricsReducer = function (
  state: LyricsState,
  action: LyricsAction
): LyricsState {
  switch (action.type) {
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "SET_SOURCE":
      if (action.source !== undefined) {
        if (action.source.syncType === "LINE_SYNCED") {
          return {
            ...state,
            sourceExists: true,
            isLineSynced: true,
            source: action.source,
          };
        } else {
          return {
            ...state,
            sourceExists: true,
            isLineSynced: false,
            source: action.source,
          };
        }
      } else {
        return {
          ...state,
          sourceExists: false,
          isLineSynced: false,
          source: undefined,
        };
      }
    default:
      throw new Error("Unknown action type");
  }
};
