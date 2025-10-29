import {
  beginDrawing,
  Black,
  Blue,
  clearBackground,
  closeWindow,
  drawCircleV,
  drawFPS,
  drawRectangleRec,
  endDrawing,
  getMousePosition,
  Green,
  initWindow,
  isKeyDown,
  KeyDown,
  KeyLeft,
  KeyRight,
  KeyUp,
  RayWhite,
  Red,
  setTargetFPS,
  windowShouldClose,
} from "../raylib-bindings.ts";
import { Scene } from "@src/scene.ts";
import { Entity, Text } from "@src/entity.ts";
import { vec } from "@src/math.ts";
import { Body } from "@src/physics.ts";

initWindow({
  title: "Example: entity body",
  height: 450,
  width: 800,
});

setTargetFPS(60);

class Rectangle1 extends Entity {
  constructor() {
    super({
      pos: vec(100, 100),
      name: "Rectangle 1",
      width: 50,
      height: 50,
      body: Body.rectangle(60, 60),
    });
  }

  override render(): void {
    drawRectangleRec({
      x: this.pos.x - this.width / 2,
      y: this.pos.y - this.height / 2,
      width: this.width,
      height: this.height,
    }, Red);
  }
}

class Rectangle2 extends Entity {
  readonly #speed = 1;

  constructor() {
    super({
      pos: vec(200, 100),
      name: "Rectangle 2",
      width: 40,
      height: 40,
      body: Body.rectangle(50, 50),
    });
  }

  override onCollision(other: Entity): void {
    console.log("Collision!", other.name);
  }

  override update(): void {
    super.update();

    if (isKeyDown(KeyLeft)) {
      this.velocity.x = -this.#speed;
    } else if (isKeyDown(KeyRight)) {
      this.velocity.x = this.#speed;
    } else {
      this.velocity.x = 0;
    }
    if (isKeyDown(KeyUp)) {
      this.velocity.y = -this.#speed;
    } else if (isKeyDown(KeyDown)) {
      this.velocity.y = this.#speed;
    } else {
      this.velocity.y = 0;
    }
  }

  override render(): void {
    drawRectangleRec({
      x: this.pos.x - this.width / 2,
      y: this.pos.y - this.height / 2,
      width: this.width,
      height: this.height,
    }, Green);
  }
}

class Circle extends Entity {
  constructor() {
    super({
      pos: vec(100, 200),
      name: "Circle",
      body: Body.Circle(30),
    });
  }

  override render(): void {
    drawCircleV({
      center: this.pos,
      color: Blue,
      radius: 25,
    });
  }
}

class MousePositionText extends Text {
  constructor() {
    super("", {
      color: Black,
      fontSize: 24,
      pos: vec(0, 0),
    });
  }

  override update(): void {
    super.update();

    const { x: mouseX, y: mouseY } = getMousePosition();
    this.text = `x: ${mouseX}, y: ${mouseY}`;
  }
}

class MainScene extends Scene {
  constructor() {
    super();

    this.entityManager.add(new Rectangle1());
    this.entityManager.add(new Rectangle2());
    this.entityManager.add(new Circle());
    this.entityManager.add(new MousePositionText());
  }
}

const scene = new MainScene();

while (windowShouldClose() === false) {
  // Update
  // ==========================================================================
  scene.update();

  // Render
  // ==========================================================================
  beginDrawing();
  clearBackground(RayWhite);
  scene.render();
  drawFPS(0, 30);
  endDrawing();
}

closeWindow();
