import React, { FC } from "react";
import BackgroundImage from "../BackgroundImage/BackgroundImage";
import styles from "./LoadingScreen.module.css";

interface LoadingScreenProps {}

const LoadingScreen: FC<LoadingScreenProps> = (props) => {
  return (
    <div className={styles.LoadingScreen}>
      <BackgroundImage
        url={"./NoAlbumImage.png"}
        initUrl={"./NoAlbumImage.png"}
      />
      <div className={styles.contents}>
        <span>Loading...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
