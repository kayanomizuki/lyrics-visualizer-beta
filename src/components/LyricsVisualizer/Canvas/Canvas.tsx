import gsap from "gsap";
import * as math from "mathjs";
import React, { FC, memo, useEffect, useMemo, useRef, useState } from "react";

import { SceneObject } from "@/types/type";

import styles from "./Canvas.module.css";

interface CanvasProps {
  scenes: SceneObject[] | undefined;
  trackDuration: number;
  progressMs: number;
  isPlaying: boolean;
}

function applyFlashAnimation(timeline: gsap.core.Timeline, scene: SceneObject) {
  const sceneSelector = `#${scene.id}`;
  const startTime = scene.startTime;
  const endTime = scene.endTime;
  const durationTime = scene.durationTime;

  timeline
    .set(
      sceneSelector,
      {
        opacity: 1,
      },
      startTime
    )
    .set(
      sceneSelector,
      {
        opacity: 0,
      },
      endTime
    );
}

function applySlideAnimation(timeline: gsap.core.Timeline, scene: SceneObject) {
  const sceneSelector = `#${scene.id}`;
  const startTime = scene.startTime;
  const endTime = scene.endTime;
  const durationTime = scene.durationTime;

  timeline
    .set(
      sceneSelector,
      {
        x: 500,
        opacity: 0,
      },
      startTime
    )
    .to(
      sceneSelector,
      {
        opacity: 1,
        duration: durationTime / 2,
      },
      startTime
    )
    .to(
      sceneSelector,
      {
        x: 0,
        duration: durationTime / 2,
        ease: "power2.out",
      },
      startTime
    )
    .to(
      sceneSelector,
      {
        x: -500,
        duration: durationTime / 2,
        ease: "power3.in",
      },
      startTime + durationTime - durationTime / 3
    )
    .to(
      sceneSelector,
      {
        opacity: 0,
        duration: durationTime / 2,
        ease: "power4.in",
      },
      startTime + durationTime - durationTime / 3
    );
}

function applyFadeOutAnimation(
  timeline: gsap.core.Timeline,
  scene: SceneObject
) {
  const sceneSelector = `#${scene.id}`;
  const startTime = scene.startTime;
  const endTime = scene.endTime;
  const durationTime = scene.durationTime;

  timeline
    .set(
      sceneSelector,
      {
        opacity: 1,
      },
      startTime
    )
    .to(
      sceneSelector,
      {
        opacity: 0,
        duration: durationTime / 2,
      },
      startTime + durationTime - durationTime / 2
    );
}

function applyTypewriterAnimation(
  timeline: gsap.core.Timeline,
  scene: SceneObject
) {
  const sceneSelector = `#${scene.id}`;
  const startTime = scene.startTime;
  const endTime = scene.endTime;
  const durationTime = scene.durationTime;

  timeline.set(
    sceneSelector,
    {
      opacity: 1,
    },
    startTime
  );

  for (let i = 0; i < scene.lines[0].split("").length; i++) {
    const letterSelector = `#${scene.id} > p > span:nth-child(${i + 1})`;
    timeline.set(
      letterSelector,
      {
        opacity: 0,
      },
      startTime
    );
  }

  for (let i = 0; i < scene.lines[0].split("").length; i++) {
    const letterSelector = `#${scene.id} > p > span:nth-child(${i + 1})`;
    timeline.to(
      letterSelector,
      {
        opacity: 1,
        duration:
          (durationTime - durationTime / 10) / (scene.lines[0].length + 3),
        ease: "power1.in",
      },
      `+=0`
    );
  }

  timeline.set(
    sceneSelector,
    {
      opacity: 0,
    },
    endTime
  );
}

function applyMultiLineWipeAnimation(
  timeline: gsap.core.Timeline,
  scene: SceneObject
) {
  const startTime = scene.startTime;
  const endTime = scene.endTime;
  const durationTime = scene.durationTime;

  const sceneSelector = `#${scene.id}`;
  timeline.set(
    sceneSelector,
    {
      opacity: 1,
    },
    startTime
  );

  for (let index = 0; index < scene.lines.length; index++) {
    const lineSelector = `#${scene.id} > p:nth-child(${index + 1})`;
    timeline.set(
      lineSelector,
      {
        opacity: 0,
        display: "none",
      },
      0
    );
  }

  const dividedDurationTime: number =
    durationTime / scene.lines.length - durationTime / 600;
  for (let index = 0; index < scene.lines.length; index++) {
    const lineSelector = `#${scene.id} > p:nth-child(${index + 1})`;
    timeline
      .set(
        lineSelector,
        {
          y: 30,
          opacity: 0,
          filter: "blur(5px)",
          display: "block",
        },
        startTime + dividedDurationTime * index
      )
      .to(
        lineSelector,
        {
          opacity: 1,
          duration: dividedDurationTime / 15,
          ease: "power2.out",
        },
        startTime + dividedDurationTime * index
      )
      .to(
        lineSelector,
        {
          y: 0,
          filter: "blur(0px)",
          duration: dividedDurationTime / 10,
          ease: "power2.out",
        },
        startTime + dividedDurationTime * index
      )
      .to(
        lineSelector,
        {
          opacity: 0,
          duration: dividedDurationTime / 10,
          ease: "power1.in",
        },
        startTime + dividedDurationTime * index + dividedDurationTime / 1.15
      )
      .to(
        lineSelector,
        {
          y: -30,
          filter: "blur(5px)",
          duration: dividedDurationTime / 10,
          ease: "power1.in",
        },
        startTime + dividedDurationTime * index + dividedDurationTime / 1.15
      )
      .to(
        lineSelector,
        {
          opacity: 0,
          filter: "blur(0px)",
          display: "none",
          duration: 0,
        },
        "+=0"
      );
  }
}

function applyMultiLineFlashAnimation(
  timeline: gsap.core.Timeline,
  scene: SceneObject
) {
  const startTime = scene.startTime;
  const endTime = scene.endTime;
  const durationTime = scene.durationTime;

  const sceneSelector = `#${scene.id}`;
  timeline.set(
    sceneSelector,
    {
      opacity: 1,
    },
    startTime
  );

  for (let index = 0; index < scene.lines.length; index++) {
    const lineSelector = `#${scene.id} > p:nth-child(${index + 1})`;
    timeline.set(
      lineSelector,
      {
        opacity: 0,
        display: "none",
      },
      0
    );
  }

  const dividedDurationTime: number =
    durationTime / scene.lines.length - durationTime / 300;
  for (let index = 0; index < scene.lines.length; index++) {
    const lineSelector = `#${scene.id} > p:nth-child(${index + 1})`;
    timeline
      .set(
        lineSelector,
        {
          opacity: 1,
          display: "block",
        },
        startTime + dividedDurationTime * index
      )
      .to(
        lineSelector,
        {
          display: "block",
          duration: dividedDurationTime,
        },
        startTime + dividedDurationTime * index
      )
      .to(
        lineSelector,
        {
          opacity: 0,
          display: "none",
          duration: 0,
        },
        "+=0"
      );
  }
}

function applyMultiLineTypewriter(
  timeline: gsap.core.Timeline,
  scene: SceneObject
) {
  const startTime = scene.startTime;
  const endTime = scene.endTime;
  const durationTime = scene.durationTime;

  const sceneSelector = `#${scene.id}`;
  timeline.set(
    sceneSelector,
    {
      opacity: 1,
    },
    startTime
  );

  for (let lineIndex = 0; lineIndex < scene.lines.length; lineIndex++) {
    const lineSelector = `#${scene.id} > p:nth-child(${lineIndex + 1})`;
    timeline.set(
      lineSelector,
      {
        opacity: 0,
        display: "none",
      },
      0
    );
    for (
      let letterIndex = 0;
      letterIndex < scene.lines[lineIndex].length;
      letterIndex++
    ) {
      const letterSelector = `#${scene.id} > p:nth-child(${
        lineIndex + 1
      }) > span:nth-child(${letterIndex + 1})`;
      timeline.set(
        letterSelector,
        {
          opacity: 0,
        },
        startTime
      );
    }
  }

  const dividedDurationTime: number =
    durationTime / scene.lines.length - durationTime / 600;
  for (let lineIndex = 0; lineIndex < scene.lines.length; lineIndex++) {
    const lineSelector = `#${scene.id} > p:nth-child(${lineIndex + 1})`;
    timeline.set(
      lineSelector,
      {
        opacity: 1,
        display: "block",
      },
      startTime + dividedDurationTime * lineIndex
    );
    for (
      let letterIndex = 0;
      letterIndex < scene.lines[lineIndex].length;
      letterIndex++
    ) {
      const letterSelector = `#${scene.id} > p:nth-child(${
        lineIndex + 1
      }) > span:nth-child(${letterIndex + 1})`;
      timeline.to(
        letterSelector,
        {
          opacity: 1,
          duration:
            (dividedDurationTime - dividedDurationTime / 10) /
            (scene.lines[0].length + 7.5),
          ease: "power1.in",
        },
        `+=0`
      );
    }
    timeline.set(
      lineSelector,
      {
        opacity: 0,
        display: "none",
      },
      startTime + dividedDurationTime * lineIndex + dividedDurationTime
    );
  }
}

function initFontSize(timeline: gsap.core.Timeline, scene: SceneObject) {
  for (let i = 0; i < scene.lines.length; i++) {
    const lineSelector = `#${scene.id} > p:nth-child(${i + 1})`;
    timeline.set(
      lineSelector,
      {
        fontSize: 2 + (15 / scene.lines[i].length) * 1.25 + "vw",
        letterSpacing: 1 + (20 / scene.lines[i].length / 20) * 10,
      },
      0
    );
  }
}

const Canvas: FC<CanvasProps> = memo((props) => {
  const [scenes, setScenes] = useState<SceneObject[]>([]);
  const timeline = useMemo(() => gsap.timeline({ paused: true }), []);

  useEffect(() => {
    if (props.isPlaying) {
      timeline.play();
    } else {
      timeline.pause();
    }
  }, [props.isPlaying]);

  useEffect(() => {
    if (math.abs(Number(timeline.time() * 1000 - props.progressMs)) > 1000) {
      timeline.seek(props.progressMs / 1000);
    } else {
      if (props.isPlaying) {
        timeline.play();
      } else {
        timeline.pause();
      }
    }
  }, [props.progressMs]);

  useEffect(() => {
    //create timeline
    for (const scene of scenes) {
      initFontSize(timeline, scene);

      if (scene.lines.length === 1) {
        switch (scene.durationCategory) {
          case "veryShort":
            applyFlashAnimation(timeline, scene);
            break;
          case "short":
            applyFlashAnimation(timeline, scene);
            break;
          case "medium":
            applyMultiLineWipeAnimation(timeline, scene);
            break;
          case "long":
            applyTypewriterAnimation(timeline, scene);
            break;
          case "veryLong":
            applyTypewriterAnimation(timeline, scene);
            break;
        }
      } else if (scene.lines.length >= 2) {
        switch (scene.durationCategory) {
          case "veryShort":
            applyMultiLineFlashAnimation(timeline, scene);
            break;
          case "short":
            applyMultiLineWipeAnimation(timeline, scene);
            break;
          case "medium":
            applyMultiLineWipeAnimation(timeline, scene);
            break;
          case "long":
            applyMultiLineWipeAnimation(timeline, scene);
            break;
          case "veryLong":
            applyMultiLineTypewriter(timeline, scene);
            break;
        }
      }
      timeline.seek(props.progressMs / 1000);
    }
  }, [scenes]);

  useEffect(() => {
    setScenes(props.scenes || []);
  }, [props.scenes]);

  return (
    <div className={styles.Canvas}>
      <div className={styles.scenes}>
        {scenes.map((scene, i) => (
          <div key={i} id={`${scene.id}`} className={styles.scene}>
            {scene.lines.map((word, i) => (
              <p key={i} className={"line"}>
                {word.split("").map((letter, i) => (
                  <span key={i}>{letter}</span>
                ))}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

Canvas.displayName = "Canvas";

export default Canvas;
