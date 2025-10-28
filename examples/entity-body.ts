import {
  beginDrawing,
  Black,
  Blue,
  clearBackground,
  closeWindow,
  drawCircleV,
  drawRectangleRec,
  drawText,
  endDrawing,
  getMousePosition,
  initWindow,
  RayWhite,
  Red,
  setTargetFPS,
  windowShouldClose,
} from "../raylib-bindings.ts";
import { Scene } from "@src/scene.ts";
import { Entity } from "@src/entity.ts";
import { vec } from "@src/math.ts";
import { CircleBody, RectangleBody } from "@src/physics.ts";

initWindow({
  title: "Example: entity body",
  height: 450,
  width: 800,
});

setTargetFPS(60);

class Rectangle extends Entity {
  constructor() {
    super({
      pos: vec(100, 100),
      width: 50,
      height: 50,
      body: new RectangleBody(60, 60),
    });
  }

  override render(): void {
    drawRectangleRec({
      x: this.pos.x - this.width / 2,
      y: this.pos.y - this.height / 2,
      width: this.width,
      height: this.height,
    }, Red);

    this.body?.render();
  }
}

class Circle extends Entity {
  constructor() {
    super({
      pos: vec(200, 100),
      body: new CircleBody(30),
    });
  }

  override render(): void {
    drawCircleV({
      center: this.pos,
      color: Blue,
      radius: 25,
    });

    this.body?.render();
  }
}

class MainScene extends Scene {
  constructor() {
    super();

    this.entityManager.add(new Rectangle());
    this.entityManager.add(new Circle());
  }
}

const scene = new MainScene();

while (windowShouldClose() === false) {
  // Update
  // ==========================================================================
  scene.update();

  // Render mouse position

  // Render
  // ==========================================================================
  beginDrawing();

  clearBackground(RayWhite);

  scene.render();

  const mousePosition = getMousePosition();
  drawText({
    color: Black,
    fontSize: 24,
    posX: 0,
    posY: 0,
    text: `x: ${mousePosition.x}, y: ${mousePosition.y}`,
  });

  endDrawing();
}

closeWindow();
