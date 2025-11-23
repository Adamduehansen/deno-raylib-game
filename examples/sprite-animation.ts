import {
  beginDrawing,
  clearBackground,
  closeWindow,
  drawTextureRec,
  endDrawing,
  initWindow,
  loadTexture,
  RayWhite,
  setTargetFPS,
  White,
  windowShouldClose,
} from "@src/raylib-bindings.ts";
import { Timer } from "@src/timer.ts";

let animationFrame = 0;
const animationTimer = new Timer({
  ms: 250,
  callback: () => {
    if (animationFrame >= 5) {
      animationFrame = 0;
    } else {
      animationFrame += 1;
    }
  },
  repeat: true,
});
animationTimer.start();

initWindow({
  title: "Animation example",
  height: 450,
  width: 800,
});

setTargetFPS(60);

const scarfy = loadTexture("./examples/resources/scarfy.png");

while (windowShouldClose() === false) {
  // Update
  // ==========================================================================
  animationTimer.update();

  // Draw
  // ==========================================================================
  beginDrawing();

  clearBackground(RayWhite);

  drawTextureRec({
    texture: scarfy,
    rectangle: {
      x: animationFrame * 128,
      y: animationFrame * 128,
      height: 128,
      width: 128,
    },
    vector: {
      x: 10,
      y: 10,
    },
    color: White,
  });

  endDrawing();
}

closeWindow();
