import React, { FC, useEffect, useState } from "react";
import styles from "./BackgroundImage.module.css";

interface BackgroundImageProps {
  url: string | undefined;
  initUrl: string;
}

const BackgroundImage: FC<BackgroundImageProps> = (props) => {
  const [url, setUrl] = useState<string>(props.initUrl);

  useEffect(() => {
    if (props.url !== undefined) {
      setUrl(props.url);
    } else {
      setUrl(props.initUrl);
    }
  }, [props.url]);

  return (
    <div
      className={styles.BackgroundImage}
      style={{
        backgroundImage: `url(${url})`,
      }}
    />
  );
};

export default BackgroundImage;
