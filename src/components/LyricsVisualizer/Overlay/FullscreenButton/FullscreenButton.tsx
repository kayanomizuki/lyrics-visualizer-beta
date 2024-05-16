import React, {
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import styles from "./FullscreenButton.module.css";

interface FullscreenButtonProps {
  displayRef: RefObject<HTMLDivElement>;
  setIsHidden: Dispatch<SetStateAction<boolean>>;
}

function adjustZoomLevel(displayRef: RefObject<HTMLDivElement>) {
  const canvasElement = displayRef.current?.getElementsByTagName("div")[0];
  if (canvasElement) {
    if (screen.height >= screen.width) {
      canvasElement.style.zoom = document.fullscreenElement ? 1.5 : 1;
    } else {
      canvasElement.style.zoom = document.fullscreenElement ? 2 : 1;
    }
  }
}

const FullscreenButton: FC<FullscreenButtonProps> = (props) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [screenOrientation, setScreenOrientation] =
    useState<OrientationType>("landscape-primary");

  const handleClick = () => {
    (function changeFullscreen() {
      if (props.displayRef.current) {
        if (isFullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        } else {
          if (props.displayRef.current.requestFullscreen) {
            props.displayRef.current.requestFullscreen();
          }
        }
      }
    })();

    (function changeScreenOrientation() {
      if (screen.orientation.type.startsWith("portrait")) {
        screen.orientation
          .lock("landscape")
          .then(() => {
            setScreenOrientation(screen.orientation.type);
          })
          .catch((error) => {
            console.warn("Screen orientation could not be changed: ", error);
          });
      } else {
        screen.orientation
          .lock("portrait")
          .then(() => {
            setScreenOrientation(screen.orientation.type);
          })
          .catch((error) => {
            console.warn("Screen orientation could not be changed: ", error);
          });
      }
    })();
  };

  useEffect(() => {
    setScreenOrientation(screen.orientation.type);

    const handleFullScreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      adjustZoomLevel(props.displayRef);
      props.setIsHidden(true);
    };

    const handleOrientationchange = () => {
      setScreenOrientation(screen.orientation.type);
      adjustZoomLevel(props.displayRef);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    window.addEventListener("orientationchange", handleOrientationchange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange
      );
      window.removeEventListener("orientationchange", handleOrientationchange);
    };
  }, []);

  return (
    <div className={styles.FullscreenButton}>
      <button onClick={handleClick}>
        {(() => {
          if (!isFullscreen) {
            return (
              <FullscreenIcon
                style={{
                  display: "block",
                  color: "white",
                  height: 22,
                }}
              />
            );
          } else {
            return (
              <FullscreenExitIcon
                style={{
                  display: "block",
                  color: "white",
                  height: 22,
                }}
              />
            );
          }
        })()}
      </button>
    </div>
  );
};

export default FullscreenButton;
