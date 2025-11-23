import {
  beginDrawing,
  Black,
  clearBackground,
  closeWindow,
  drawText,
  endDrawing,
  initWindow,
  RayWhite,
  setTargetFPS,
  windowShouldClose,
} from "@src/raylib-bindings.ts";
import { Timer } from "@src/timer.ts";

initWindow({
  title: "Timer example",
  width: 800,
  height: 450,
});

setTargetFPS(60);

let singleShotCallbacks = 0;
let repeatingCallbacks = 0;

const singleShotTimer = new Timer({
  ms: 1000,
  callback: () => {
    singleShotCallbacks += 1;
  },
});
singleShotTimer.start();

const repeatingTimer = new Timer({
  ms: 1000,
  callback: () => {
    repeatingCallbacks += 1;
  },
  repeat: true,
});
repeatingTimer.start();

while (windowShouldClose() === false) {
  // Update
  // --------------------------------------------------------------------------
  singleShotTimer.update();
  repeatingTimer.update();

  // Draw
  // --------------------------------------------------------------------------
  beginDrawing();
  clearBackground(RayWhite);

  drawText({
    text: `Singleshot ms: ${singleShotTimer.ms}`,
    color: Black,
    fontSize: 24,
    posX: 10,
    posY: 10,
  });

  drawText({
    text: `Singleshot elapsed: ${singleShotTimer.elapsed.toFixed(3)}`,
    color: Black,
    fontSize: 24,
    posX: 10,
    posY: 30,
  });

  drawText({
    text: `Singleshot callbacks: ${singleShotCallbacks}`,
    color: Black,
    fontSize: 24,
    posX: 10,
    posY: 50,
  });

  drawText({
    text: `Repeat ms: ${repeatingTimer.ms}`,
    color: Black,
    fontSize: 24,
    posX: 400,
    posY: 10,
  });

  drawText({
    text: `Repeat elapsed: ${repeatingTimer.elapsed.toFixed(3)}`,
    color: Black,
    fontSize: 24,
    posX: 400,
    posY: 30,
  });

  drawText({
    text: `Repeat callbacks: ${repeatingCallbacks}`,
    color: Black,
    fontSize: 24,
    posX: 400,
    posY: 50,
  });

  endDrawing();
}

closeWindow();
