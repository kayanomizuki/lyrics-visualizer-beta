import { ROOT } from "@/utils/constants";
import {
  AccessTokenObject,
  LyricsObject,
  RefreshedAccessTokenObject,
} from "@/types/type";
import isAccessTokenObject, {
  isLyricsObject,
  isRefreshedAccessTokenObject,
} from "@/types/typeGuards";

import {
  LOCAL_API_MUSIXMATCH_LYRICS_API_URL,
  LOCAL_API_SPOTIFY_ACCESS_TOKEN_URL,
  LOCAL_API_SPOTIFY_REFRESHED_ACCESS_TOKEN_URL,
} from "./constants";

export const fetchLyricsSource = async function (
  trackId: string,
  accessToken: string
): Promise<LyricsObject | undefined> {
  const response = await fetch(
    `${LOCAL_API_MUSIXMATCH_LYRICS_API_URL}/?trackid=${trackId}&accesstoken=${accessToken}`,
    {
      method: "GET",
      referrer: `${ROOT}`,
      referrerPolicy: "no-referrer-when-downgrade",
    }
  )
    .then((response) => {
      if (!response.ok) {
        if (response.status == 404) {
          console.warn("This track has not exists lyrics data :(");
          return undefined;
        }
        console.error("response.ok:", response.ok);
        console.error("response.status:", response.status);
        console.error("response.statusText:", response.statusText);
        throw new Error(response.statusText);
      }
      //Response.OK(200-299)
      return response.json();
    })
    .catch((error) => {
      console.error("An error has occurred.", error);
    });

  if (isLyricsObject(response)) {
    const lyricsSource: LyricsObject = response;
    lyricsSource.lines.unshift({
      startTimeMs: 0,
      words: "♪",
      syllables: [],
      endTimeMs: 0,
    });
    if (lyricsSource.syncType !== "LINE_SYNCED") {
      console.warn("This track has not synced lyrics line :(");
    }
    return lyricsSource;
  }
  return undefined;
};

export const fetchRefreshedAccessToken = async function (): Promise<
  RefreshedAccessTokenObject | undefined
> {
  const response = await fetch(
    `${LOCAL_API_SPOTIFY_REFRESHED_ACCESS_TOKEN_URL}`
  )
    .then((response) => {
      if (!response.ok) {
        console.error("response.ok:", response.ok);
        console.error("response.status:", response.status);
        console.error("response.statusText:", response.statusText);
        throw new Error(response.statusText);
      }
      //Response.OK(200-299)
      return response.json();
    })
    .catch((error) => {
      console.error("An error has occurred.", error);
    });

  if (isRefreshedAccessTokenObject(response)) {
    const refreshedAccessTokenObject: RefreshedAccessTokenObject = response;
    return refreshedAccessTokenObject;
  }
  return undefined;
};

export const fetchAccessToken = async function (
  code: string
): Promise<AccessTokenObject | undefined> {
  const response = await fetch(
    `${LOCAL_API_SPOTIFY_ACCESS_TOKEN_URL}?code=${code}`
  )
    .then((response) => {
      if (!response.ok) {
        console.error("response.ok:", response.ok);
        console.error("response.status:", response.status);
        console.error("response.statusText:", response.statusText);
        throw new Error(response.statusText);
      }
      //Response.OK(200-299)
      return response.json();
    })
    .catch((error) => {
      console.error("An error has occurred.", error);
    });

  if (isAccessTokenObject(response)) {
    const accessTokenObject: AccessTokenObject = response;
    return accessTokenObject;
  }
  return undefined;
};
