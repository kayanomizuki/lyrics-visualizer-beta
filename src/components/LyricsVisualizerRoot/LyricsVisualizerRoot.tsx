import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useMemo, useReducer } from "react";
import { SpotifyWebApi } from "spotify-web-api-ts";

import {
  animationReducer,
  initialAnimationState,
} from "@/reducers/animationReducer";
import {
  initiallyricsState as initialLyricsState,
  lyricsReducer,
} from "@/reducers/lyricsReducer";
import { initialSpotifyState, spotifyReducer } from "@/reducers/spotifyReducer";
import { isRefreshedAccessTokenObject } from "@/types/typeGuards";
import { fetchLyricsSource, fetchRefreshedAccessToken } from "@/utils/api";

import HeaderBar from "../HeaderBar/HeaderBar";
import LyricsVisualizer from "../LyricsVisualizer/LyricsVisualizer";
import StateTable from "../StateTable/StateTable";
import TrackInformation from "../TrackInformation/TrackInformation";
import styles from "./LyricsVisualizerRoot.module.css";
import BackgroundImage from "../BackgroundImage/BackgroundImage";
import SeekBar from "../LyricsVisualizer/SeekBar/SeekBar";

interface LyricsVisualizerRootProps {
  accessToken: string;
}

const LyricsVisualizerRoot: FC<LyricsVisualizerRootProps> = (props) => {
  const spotifyWebApi: SpotifyWebApi = useMemo(() => {
    return new SpotifyWebApi({
      accessToken: props.accessToken,
    });
  }, []);

  const [spotifyState, spotifyDispatch] = useReducer(
    spotifyReducer,
    initialSpotifyState
  );

  const [lyricsState, lyricsDispatch] = useReducer(
    lyricsReducer,
    initialLyricsState
  );

  const [animationState, animationDispatch] = useReducer(
    animationReducer,
    initialAnimationState
  );

  useEffect(
    function updateAnimationCurrentScene() {
      animationDispatch({
        type: "UPDATE_CURRENT_SCENE",
        trackProgressMs: spotifyState.trackProgressMs,
      });
    },
    [animationState.scenes, spotifyState.trackProgressMs]
  );

  useEffect(
    function updateAnimationScenes() {
      animationDispatch({
        type: "UPDATE_SCENES",
        lyricsLines: lyricsState.source?.lines,
        trackDuration: spotifyState.trackDuration,
      });
    },
    [lyricsState.source]
  );

  useEffect(
    function updateLyricsSource() {
      lyricsDispatch({ type: "SET_SOURCE", source: undefined });
      if (spotifyState.trackId !== undefined) {
        const trackId = spotifyState.trackId;
        (async () => {
          lyricsDispatch({ type: "SET_IS_LOADING", isLoading: true });
          const lyricsSource = await fetchLyricsSource(
            trackId,
            spotifyWebApi.getAccessToken()
          );
          lyricsDispatch({ type: "SET_IS_LOADING", isLoading: false });
          if (lyricsSource !== undefined) {
            lyricsDispatch({
              type: "SET_SOURCE",
              source: lyricsSource,
            });
          } else {
            lyricsDispatch({
              type: "SET_SOURCE",
              source: undefined,
            });
          }
        })();
      }
    },
    [spotifyState.trackId]
  );

  useEffect(
    function updateDocumentTitle() {
      if (!spotifyState.isConnected) {
        document.title = "Connecting to Spotify...";
      } else if (spotifyState.isStandby) {
        document.title = "Standby for music to play on Spotify ;)";
      } else {
        document.title = `${spotifyState.trackName} by ${spotifyState.artistName}`;
      }
    },
    [
      spotifyState.isConnected,
      spotifyState.isStandby,
      spotifyState.trackName,
      spotifyState.artistName,
    ]
  );

  useEffect(
    function updatetrackProgressMs() {
      if (!spotifyState.isPlaying) return;
      const timer = setInterval(() => {
        spotifyDispatch({
          type: "UPDATE_TRACK_PROGRESS_MS",
          addition: 10,
        });
      }, 10);
      return () => {
        clearInterval(timer);
      };
    },
    [spotifyState.trackProgress]
  );

  useEffect(function constructor() {
    setInterval(async function updateSpotifyState() {
      const spotifyPlaybackInfo = await spotifyWebApi.player
        .getPlaybackInfo()
        .then((response) => {
          spotifyDispatch({ type: "SET_IS_CONNECTED", isConnected: true });
          if (!response) {
            spotifyDispatch({ type: "SET_IS_STANDBY", isStandby: true });
          } else {
            spotifyDispatch({ type: "SET_IS_STANDBY", isStandby: false });
          }
          return response;
        })
        .catch((error) => {
          spotifyDispatch({ type: "SET_IS_CONNECTED", isConnected: false });
          spotifyDispatch({ type: "SET_IS_STANDBY", isStandby: false });
          return null;
        });
      spotifyDispatch({
        type: "UPDATE_STATE",
        spotifyPlaybackInfo: spotifyPlaybackInfo,
      });
    }, 1000);

    setInterval(async function updateAccessToken() {
      const refreshedAccessToken = await fetchRefreshedAccessToken();
      if (isRefreshedAccessTokenObject(refreshedAccessToken)) {
        spotifyWebApi.setAccessToken(refreshedAccessToken.access_token);
      }
    }, (3600 - 60) * 1000);
  }, []);

  return (
    <div className={styles.LyricsVisualizerRoot}>
      <BackgroundImage
        url={spotifyState.albumImageUrl}
        initUrl={"./NoAlbumImage.png"}
      />
      <div className={styles.contents}>
        <div className={styles.lyricsVisualizer}>
          <LyricsVisualizer
            spotifyState={spotifyState}
            lyricsState={lyricsState}
            animationState={animationState}
          />
        </div>
        <div className={styles.status}>
          <div className={styles.trackInformation}>
            <TrackInformation spotifyState={spotifyState} />
          </div>
          <div className={styles.seekBar}>
            <SeekBar
              duration={spotifyState.trackDuration}
              progress={spotifyState.trackProgressMs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyricsVisualizerRoot;
