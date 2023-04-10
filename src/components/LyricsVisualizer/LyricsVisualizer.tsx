import React, { FC, lazy, memo, Suspense, useRef } from "react";

import { AnimationState } from "@/reducers/animationReducer";
import { LyricsState } from "@/reducers/lyricsReducer";
import { SpotifyState } from "@/reducers/spotifyReducer";

import styles from "./LyricsVisualizer.module.css";
import Overlay from "./Overlay/Overlay";
import SeekBar from "./SeekBar/SeekBar";

const Canvas = lazy(() => import("./Canvas/Canvas"));

interface LyricsVisualizerProps {
  spotifyState: SpotifyState;
  lyricsState: LyricsState;
  animationState: AnimationState;
}

const LyricsVisualizer: FC<LyricsVisualizerProps> = memo((props) => {
  const displayRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={displayRef} className={styles.LyricsVisualizer}>
      {(() => {
        if (!props.spotifyState.isConnected) {
          return (
            <div className={styles.connectingToSpotify}>
              {"Connecting to Spotify..."}
            </div>
          );
        } else if (props.spotifyState.isStandby) {
          return (
            <div className={styles.spotifyisStandby}>
              {"Standby for music to play on Spotify ;)"}
            </div>
          );
        } else if (props.lyricsState.isLoading) {
          return (
            <div className={styles.lyricsIsLoading}>
              {"Lyrics data is loading..."}
            </div>
          );
        } else if (!props.lyricsState.sourceExists) {
          return (
            <div className={styles.lyricsDataNotExists}>
              {"This track has not exists lyrics data :("}
            </div>
          );
        } else if (!props.lyricsState.isLineSynced) {
          return (
            <div className={styles.lyricsLineNotSynced}>
              {"This track has not synced lyrics line :("}
            </div>
          );
        } else {
          return (
            <Suspense fallback="">
              <Canvas
                scenes={props.animationState.scenes}
                trackDuration={props.spotifyState.trackDuration}
                progressMs={props.spotifyState.trackProgressMs}
                isPlaying={props.spotifyState.isPlaying}
              />
            </Suspense>
          );
        }
      })()}
      <Overlay displayRef={displayRef} spotifyState={props.spotifyState} />
    </div>
  );
});

LyricsVisualizer.displayName = "LyricsVisualizer";
export default LyricsVisualizer;
