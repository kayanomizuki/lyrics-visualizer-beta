import { loadDefaultJapaneseParser } from "budoux";
import * as math from "mathjs";

import { LyricsLineObject, SceneObject } from "@/types/type";
import { createEqualLengthStrArray, isEnglish } from "@/utils/functions";

export type AnimationState = {
  scenes: SceneObject[] | undefined;
  currentScene: SceneObject | undefined;
};

export type AnimationAction =
  | {
      type: "UPDATE_SCENES";
      lyricsLines: LyricsLineObject[] | undefined;
      trackDuration: number;
    }
  | { type: "UPDATE_CURRENT_SCENE"; trackProgressMs: number };

export const initialAnimationState: AnimationState = {
  scenes: undefined,
  currentScene: undefined,
};

const formatWords = function (words: string) {
  const convertToFullWidth = function (input: string) {
    return input.replace(/[!-/:-@[-`{-~]/g, function (input) {
      return String.fromCharCode(input.charCodeAt(0) + 65248);
    });
  };

  const toHalfWidth = function (input: string) {
    return input.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (input) {
      return String.fromCharCode(input.charCodeAt(0) - 65248);
    });
  };

  if (words === "" || words === undefined) return words;
  if (words === "♪") words = " ";
  if (words === "<♪>") words = " ";
  if (words === "＜♪＞") words = " ";

  if (
    !(
      String(words[0]) === "(" &&
      String(words.substring(words.length - 1)) === ")"
    )
  ) {
    words = words.replace(/\(.+?\)/g, "");
  }
  if (
    !(
      String(words[0]) === "（" &&
      String(words.substring(words.length - 1)) === "）"
    )
  ) {
    words = words.replace(/\（.+?\）/g, "");
  }
  if (
    !(
      String(words[0]) === "【" &&
      String(words.substring(words.length - 1)) === "】"
    )
  ) {
    words = words.replace(/\【.+?\】/g, "");
  }
  words = String(toHalfWidth(words));
  words = String(convertToFullWidth(words));
  words = words.replace(/＇/g, "'");
  words = words.replace(/＂/g, '"');
  words = words.replace(/  /g, " ");

  return words;
};

function createScenes(
  lyricsLines: LyricsLineObject[] | undefined,
  trackDuration: number
): SceneObject[] | undefined {
  if (lyricsLines === undefined) {
    return undefined;
  }
  const lyricsLinesLength = Object.keys(lyricsLines).length;

  // initialize of scenes
  const scenes: SceneObject[] = [] as SceneObject[];
  for (let index = 0; index < lyricsLinesLength - 1; index++) {
    scenes.push({
      id: `scene${index}`,
      lines: [formatWords(lyricsLines[index].words)],
      startTime: lyricsLines[index].startTimeMs / 1000,
      endTime: lyricsLines[index + 1].startTimeMs / 1000,
      durationTime:
        (lyricsLines[index + 1].startTimeMs - lyricsLines[index].startTimeMs) /
        1000,
      durationCategory: "medium",
    });
  }
  scenes.push({
    id: `scene${lyricsLinesLength - 1}`,
    lines: [formatWords(lyricsLines[lyricsLinesLength - 1].words)],
    startTime: lyricsLines[lyricsLinesLength - 1].startTimeMs / 1000,
    endTime: trackDuration / 1000,
    durationTime:
      (trackDuration - lyricsLines[lyricsLinesLength - 1].startTimeMs) / 1000,
    durationCategory: "medium",
  });

  // normalize of duration(at calc durationZscore)
  var durations: number[] = [];
  for (const scene of scenes) {
    durations.push(scene.durationTime);
  }
  for (let index = 0; index < scenes.length; index++) {
    const durationZscore =
      (scenes[index].durationTime - Number(math.mean(durations))) /
      Number(math.std(durations, "unbiased"));
    if (durationZscore > 1.8 && index > 0) {
      scenes[index].durationTime = scenes[index - 1].durationTime;
    }
  }

  // set durationCategory
  var durations: number[] = [];
  for (const scene of scenes) {
    durations.push(scene.durationTime);
  }
  for (const scene of scenes) {
    if (scene.durationTime < Number(math.quantileSeq(durations, 0.2))) {
      scene.durationCategory = "veryShort";
    } else if (
      scene.durationTime >= Number(math.quantileSeq(durations, 0.2)) &&
      scene.durationTime < Number(math.quantileSeq(durations, 0.4))
    ) {
      scene.durationCategory = "short";
    } else if (
      scene.durationTime >= Number(math.quantileSeq(durations, 0.4)) &&
      scene.durationTime < Number(math.quantileSeq(durations, 0.6))
    ) {
      scene.durationCategory = "medium";
    } else if (
      scene.durationTime >= Number(math.quantileSeq(durations, 0.6)) &&
      scene.durationTime < Number(math.quantileSeq(durations, 0.8))
    ) {
      scene.durationCategory = "long";
    } else if (scene.durationTime >= Number(math.quantileSeq(durations, 0.8))) {
      scene.durationCategory = "veryLong";
    }
  }

  // parse of words
  const parser = loadDefaultJapaneseParser();
  for (const scene of scenes) {
    scene.lines = (function parseWords() {
      if (isEnglish(scene.lines[0])) {
        if (scene.lines[0].replaceAll(" ", "").length >= 30) {
          if (
            scene.durationCategory !== "veryShort" &&
            scene.durationCategory !== "veryLong"
          ) {
            const str: string = parser
              .parse(scene.lines[0])
              .join(" ")
              .replaceAll("  ", " ");
            return createEqualLengthStrArray(str, 2.2);
          } else {
            return scene.lines;
          }
        } else {
          return scene.lines;
        }
      } else {
        if (
          scene.lines[0].replaceAll(" ", "").length > 15 &&
          scene.lines[0].replaceAll(" ", "").length <= 30
        ) {
          if (
            scene.durationCategory !== "veryShort" &&
            scene.durationCategory !== "veryLong"
          ) {
            const str: string = parser
              .parse(scene.lines[0])
              .join(" ")
              .replaceAll("  ", " ");
            return createEqualLengthStrArray(str, 2.4);
          } else {
            const str: string = parser
              .parse(scene.lines[0])
              .join(" ")
              .replaceAll("  ", " ");
            return createEqualLengthStrArray(str, 2.4);
          }
        } else if (scene.lines[0].replaceAll(" ", "").length >= 30) {
          const str: string = parser
            .parse(scene.lines[0])
            .join(" ")
            .replaceAll("  ", " ");
          return createEqualLengthStrArray(str, 3);
        } else {
          return scene.lines;
        }
      }
    })();
  }

  return scenes;
}

export const animationReducer = function (
  state: AnimationState,
  action: AnimationAction
): AnimationState {
  switch (action.type) {
    case "UPDATE_SCENES":
      const scenes = createScenes(action.lyricsLines, action.trackDuration);
      return { ...state, scenes: scenes };
    case "UPDATE_CURRENT_SCENE":
      let currentScene: SceneObject | undefined = undefined;
      if (state.scenes !== undefined) {
        currentScene = [...state.scenes]
          .reverse()
          .find((scene) => scene.startTime < action.trackProgressMs / 1000);
      }
      return { ...state, currentScene: currentScene };
    default:
      throw new Error("Unknown action type");
  }
};
