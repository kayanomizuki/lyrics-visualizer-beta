export type AccessTokenObject = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

export type RefreshedAccessTokenObject = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
};

export type LyricsObject = {
  error: boolean;
  syncType: string;
  lines: LyricsLineObject[];
};

export type LyricsLineObject = {
  startTimeMs: number;
  words: string;
  syllables: any[];
  endTimeMs: number;
};

export type SceneObject = {
  id: string;
  lines: string[];
  startTime: number;
  endTime: number;
  durationTime: number;
  durationCategory: DurationCategory;
};

export type DurationCategory =
  | "veryShort"
  | "short"
  | "medium"
  | "long"
  | "veryLong";
