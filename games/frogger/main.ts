import {
  beginDrawing,
  clearBackground,
  closeWindow,
  Color,
  drawRectangleRec,
  endDrawing,
  getFrameTime,
  getScreenHeight,
  getScreenWidth,
  Green,
  initWindow,
  isKeyPressed,
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
  color: Color;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.color = RayWhite;
  }

  abstract update(): void;

  render() {
    drawRectangleRec({
      x: this.x,
      y: this.y,
      width: 16,
      height: 16,
    }, this.color);
  }
}

class Frog extends Entity {
  constructor() {
    super();
    this.color = Green;
  }

  override update(): void {
    if (isKeyPressed(KeyA)) {
      frog.x -= GridSize;
    } else if (isKeyPressed(KeyD)) {
      frog.x += GridSize;
    }

    if (isKeyPressed(KeyW)) {
      frog.y -= GridSize;
    } else if (isKeyPressed(KeyS)) {
      frog.y += GridSize;
    }
  }
}

class Car extends Entity {
  constructor() {
    super();
    this.color = Red;
  }

  override update(): void {
    const deltaTime = getFrameTime();

    if (this.x < -GridSize) {
      this.x = getScreenWidth();
    } else {
      this.x -= carSpeed * deltaTime;
    }
  }
}

const GridSize = 16;

initWindow({
  title: "Frogger",
  height: 240,
  width: 176,
});

setTargetFPS(60);

const entities: Entity[] = [];

const frog = new Frog();
frog.x = 0;
frog.y = getScreenHeight() - GridSize;
entities.push(frog);

const car1 = new Car();
car1.x = getScreenWidth() - GridSize;
car1.y = getScreenHeight() - GridSize * 2;
entities.push(car1);

const car2 = new Car();
car2.x = getScreenWidth() - GridSize * 5;
car2.y = getScreenHeight() - GridSize * 2;
entities.push(car2);

const car3 = new Car();
car3.x = getScreenWidth() - GridSize * 9;
car3.y = getScreenHeight() - GridSize * 2;
entities.push(car3);

const carSpeed = 30;

// async function* shouldClose() {
//   while (true) {
//     await new Promise((r) => setTimeout(r, FrogSize));
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

  for (const entity of entities) {
    entity.update();
  }

  // Draw
  // --------------------------------------------------------------------------

  beginDrawing();

  clearBackground(RayWhite);

  for (const entity of entities) {
    entity.render();
  }

  endDrawing();
}

closeWindow();
