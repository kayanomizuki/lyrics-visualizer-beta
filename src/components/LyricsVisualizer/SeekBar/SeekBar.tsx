import React, { FC, useEffect, useState } from "react";

import styles from "./SeekBar.module.css";

interface SeekBarProps {
  duration: number;
  progress: number;
}

const SeekBar: FC<SeekBarProps> = (props) => {
  const [progressRate, setProgressRate] = useState<number>(0);

  useEffect(() => {
    setProgressRate((props.progress / props.duration) * 100);
  }, [props.progress, props.duration]);

  return (
    <div className={styles.SeekBar}>
      <div className={styles.duration} />
      <div
        className={styles.progress}
        style={{ width: progressRate + "%", maxWidth: 100 + "%" }}
      />
    </div>
  );
};
export default SeekBar;
