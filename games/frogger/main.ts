import {
  beginDrawing,
  clearBackground,
  closeWindow,
  drawRectangle,
  drawRectangleRec,
  endDrawing,
  getFrameTime,
  getScreenHeight,
  getScreenWidth,
  Green,
  initWindow,
  isKeyDown,
  KeyA,
  KeyD,
  KeyS,
  KeyW,
  RayWhite,
  Red,
  setTargetFPS,
  windowShouldClose,
} from "../../raylib-bindings.ts";

abstract class Entity {
  x: number;
  y: number;

  constructor() {
    this.x = 0;
    this.y = 0;
  }
}

class Frog extends Entity {
}

class Car extends Entity {
  constructor(args: {
    type: "A" | "B" | "C" | "D" | "E";
  }) {
    super();
  }
}

initWindow({
  title: "Frogger",
  height: 260,
  width: 230,
});

setTargetFPS(60);

const frog = new Frog();
frog.x = getScreenWidth() / 2 - 8;
frog.y = getScreenHeight() / 2 - 8;
const frogSpeed = 1;

const car = new Car({
  type: "A",
});
car.x = getScreenWidth();
car.y = getScreenHeight() / 2 - 8;
const carSpeed = 30;

// async function* shouldClose() {
//   while (true) {
//     await new Promise((r) => setTimeout(r, 16));
//     yield windowShouldClose();
//   }
// }

// for await (const close of shouldClose()) {
//   if (close) {
//     break;
//   }

while (windowShouldClose() === false) {
  // Update
  // --------------------------------------------------------------------------

  const deltaTime = getFrameTime();

  // Frog update
  if (isKeyDown(KeyA)) {
    frog.x -= frogSpeed;
  } else if (isKeyDown(KeyD)) {
    frog.x += frogSpeed;
  }

  if (isKeyDown(KeyW)) {
    frog.y -= frogSpeed;
  } else if (isKeyDown(KeyS)) {
    frog.y += frogSpeed;
  }

  // Car update
  if (car.x < -16) {
    car.x = getScreenWidth();
  } else {
    car.x -= carSpeed * deltaTime;
  }

  // Draw
  // --------------------------------------------------------------------------

  beginDrawing();

  clearBackground(RayWhite);

  // Frog
  drawRectangle({
    width: 16,
    height: 16,
    posX: frog.x,
    posY: frog.y,
    color: Green,
  });

  // Car
  drawRectangleRec({
    x: car.x,
    y: car.y,
    height: 16,
    width: 16,
  }, Red);

  endDrawing();
}

closeWindow();
