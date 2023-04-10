import { url } from "inspector";
import React, { FC, useEffect, useState } from "react";

import { SpotifyState } from "@/reducers/spotifyReducer";

import styles from "./TrackInformation.module.css";

interface TrackInformationProps {
  spotifyState: SpotifyState;
}

const TrackInformation: FC<TrackInformationProps> = (props) => {
  const [trackName, setTrackName] = useState<string>("TrackName");
  const [artistName, setArtistName] = useState<string>("ArtistName");
  const [albumName, setAlbumName] = useState<string>("AlbumName");

  useEffect(() => {
    if (props.spotifyState.albumName !== undefined) {
      setAlbumName(props.spotifyState.albumName);
    } else {
      setAlbumName("TrackName");
    }
  }, [props.spotifyState.albumName]);

  useEffect(() => {
    if (props.spotifyState.artistName !== undefined) {
      setArtistName(props.spotifyState.artistName);
    } else {
      setArtistName("ArtistName");
    }
  }, [props.spotifyState.artistName]);

  useEffect(() => {
    if (props.spotifyState.trackName !== undefined) {
      setTrackName(props.spotifyState.trackName);
    } else {
      setTrackName("AlbumName");
    }
  }, [props.spotifyState.trackName]);

  return (
    <div className={styles.TrackInformation}>
      <div className={styles.names}>
        <span className={styles.trackName}>{`${trackName}`}</span>
        <span className={styles.artistName}>{`${artistName}`}</span>
        <span className={styles.albumName}>{`${albumName}`}</span>
      </div>
    </div>
  );
};

export default TrackInformation;
