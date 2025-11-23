import {
  beginDrawing,
  Black,
  clearBackground,
  endDrawing,
  initWindow,
  isKeyPressed,
  KeyEnter,
  RayWhite,
  setTargetFPS,
  windowShouldClose,
} from "@src/raylib-bindings.ts";
import { Text } from "../src/entity.ts";
import { Scene } from "../src/scene.ts";

class SceneA extends Scene {
  constructor() {
    super();
    this.add(
      new Text("Hello, SceneA", {
        color: Black,
        fontSize: 32,
        pos: {
          x: 10,
          y: 10,
        },
      }),
    );
  }
}

class SceneB extends Scene {
  constructor() {
    super();
    this.add(
      new Text("Hello, SceneB", {
        color: Black,
        fontSize: 32,
        pos: {
          x: 10,
          y: 10,
        },
      }),
    );
  }
}

initWindow({
  title: "Examples - scenes",
  height: 450,
  width: 800,
});

setTargetFPS(60);

const sceneA = new SceneA();
const sceneB = new SceneB();

const scenes = {
  sceneA: sceneA,
  sceneB: sceneB,
} as const;

type SceneKey = keyof typeof scenes;

let currentScene: SceneKey = "sceneA";

while (windowShouldClose() === false) {
  // Update
  // ==========================================================================
  if (isKeyPressed(KeyEnter)) {
    if (currentScene === "sceneA") {
      currentScene = "sceneB";
    } else {
      currentScene = "sceneA";
    }
  }

  // Draw
  // ==========================================================================
  beginDrawing();

  clearBackground(RayWhite);

  scenes[currentScene].render();

  endDrawing();
}
