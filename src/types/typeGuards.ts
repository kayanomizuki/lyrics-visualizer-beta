import {
  AccessTokenObject,
  LyricsLineObject,
  LyricsObject,
  RefreshedAccessTokenObject,
} from "./type";

export default function isAccessTokenObject(
  value: any
): value is AccessTokenObject {
  return (
    value !== undefined &&
    typeof value.access_token === "string" &&
    typeof value.token_type === "string" &&
    typeof value.scope === "string" &&
    typeof value.expires_in === "number" &&
    typeof value.refresh_token === "string"
  );
}

export function isRefreshedAccessTokenObject(
  value: any
): value is RefreshedAccessTokenObject {
  return (
    value !== undefined &&
    typeof value.access_token === "string" &&
    typeof value.token_type === "string" &&
    typeof value.scope === "string" &&
    typeof value.expires_in === "number"
  );
}

export function isLyricsLineObject(value: any): value is LyricsLineObject {
  return (
    value !== undefined &&
    typeof value.startTimeMs === "number" &&
    typeof value.words === "string" &&
    typeof value.syllables === "object" &&
    typeof value.endTimeMs === "number"
  );
}

export function isLyricsObject(value: any): value is LyricsObject {
  return (
    value !== undefined &&
    typeof value.error === "boolean" &&
    typeof value.syncType === "string" &&
    typeof value.lines === "object"
  );
}
