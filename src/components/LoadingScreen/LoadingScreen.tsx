import React, { FC } from "react";
import styles from "./LoadingScreen.module.css";

interface LoadingScreenProps {}

const LoadingScreen: FC<LoadingScreenProps> = (props) => {
  return (
    <div className={styles.LoadingScreen}>
      <span>loading...</span>
    </div>
  );
};

export default LoadingScreen;
