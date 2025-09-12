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

interface CarArgs {
  direction: "left" | "right";
}

class Car extends Entity {
  direction: CarArgs["direction"] = "left";

  constructor(args: CarArgs) {
    super();
    this.color = Red;
    this.direction = args.direction;
  }

  override update(): void {
    const deltaTime = getFrameTime();

    if (this.direction === "left") {
      if (this.x < -GridSize) {
        this.x = getScreenWidth();
      } else {
        this.x -= carSpeed * deltaTime;
      }
    } else {
      if (this.x > getScreenWidth()) {
        this.x = -GridSize;
      } else {
        this.x += carSpeed * deltaTime;
      }
    }
  }
}

const GridSize = 16;

initWindow({
  title: "Frogger",
  height: 240,
  width: 240,
});

setTargetFPS(60);

const entities: Entity[] = [];

const frog = new Frog();
frog.x = 0;
frog.y = getScreenHeight() - GridSize;
entities.push(frog);

const row1Car1 = new Car({
  direction: "left",
});
row1Car1.x = getScreenWidth() - GridSize;
row1Car1.y = getScreenHeight() - GridSize * 2;
entities.push(row1Car1);

const row1Car2 = new Car({
  direction: "left",
});
row1Car2.x = getScreenWidth() - GridSize * 6;
row1Car2.y = getScreenHeight() - GridSize * 2;
entities.push(row1Car2);

const row1Car3 = new Car({
  direction: "left",
});
row1Car3.x = getScreenWidth() - GridSize * 11;
row1Car3.y = getScreenHeight() - GridSize * 2;
entities.push(row1Car3);

const row2Car1 = new Car({
  direction: "right",
});
row2Car1.x = -GridSize;
row2Car1.y = getScreenHeight() - GridSize * 3;
entities.push(row2Car1);

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
