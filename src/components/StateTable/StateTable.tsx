import React, { FC, memo } from "react";

import { AnimationState } from "@/reducers/animationReducer";
import { LyricsState } from "@/reducers/lyricsReducer";
import { SpotifyState } from "@/reducers/spotifyReducer";

import styles from "./StateTable.module.css";

interface StateTableProps {
  caption: string;
  state: SpotifyState | LyricsState | AnimationState;
}

const StateTable: FC<StateTableProps> = memo((props) => {
  return (
    <div className={styles.StateTable}>
      <table>
        <caption>{props.caption}</caption>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(props.state).map(([key, value]) => (
            <tr key={key}>
              <td style={{ minWidth: 125 }}>{key}</td>
              <td>
                <textarea
                  value={
                    value !== undefined
                      ? JSON.stringify(value, null, "  ")
                      : typeof value
                  }
                  readOnly
                ></textarea>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

StateTable.displayName = "StateTable";

export default StateTable;
