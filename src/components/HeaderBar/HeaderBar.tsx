import React, { FC } from "react";
import styles from "./HeaderBar.module.css";

interface HeaderBarProps {}

const HeaderBar: FC<HeaderBarProps> = (props) => {
  return (
    <div className={styles.HeaderBar}>
      <h2>Lyrics Visualizer</h2>
    </div>
  );
};

export default HeaderBar;
