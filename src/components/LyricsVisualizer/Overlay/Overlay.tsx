import React, { FC, memo, RefObject, useEffect, useState } from "react";

import { SpotifyState } from "@/reducers/spotifyReducer";

import FullscreenButton from "./FullscreenButton/FullscreenButton";
import styles from "./Overlay.module.css";

interface OverlayProps {
  spotifyState: SpotifyState;
  displayRef: RefObject<HTMLDivElement>;
}

const Overlay: FC<OverlayProps> = memo((props) => {
  const [isHidden, setIsHidden] = useState<boolean>(false);

  const handleClick = () => {
    (function changeFullscreen() {
      if (isHidden) {
        setIsHidden(false);
      } else {
        setIsHidden(true);
      }
    })();
  };

  return (
    <div
      onClick={handleClick}
      className={styles.Overlay}
      style={isHidden ? { opacity: 0 } : { opacity: 1 }}
    >
      <FullscreenButton
        displayRef={props.displayRef}
        setIsHidden={setIsHidden}
      />
    </div>
  );
});

Overlay.displayName = "Overlay";

export default Overlay;
