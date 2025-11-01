import { Entity } from "@src/entity.ts";
import {
  Black,
  drawRectangle,
  getScreenHeight,
  getScreenWidth,
  isKeyDown,
  KeyA,
  KeyD,
} from "../../raylib-bindings.ts";
import { Body } from "@src/physics.ts";

export class Paddle extends Entity {
  static width = 80;
  static height = 20;
  static speed = 5;

  constructor() {
    super({
      pos: {
        x: getScreenWidth() / 2,
        y: Math.floor(getScreenHeight() * 7 / 8),
      },
      width: Paddle.width,
      height: Paddle.height,
      name: "paddle",
      body: Body.rectangle(Paddle.width, Paddle.height),
    });
  }

  override update(): void {
    super.update();
    if (isKeyDown(KeyD)) {
      this.velocity.x = Paddle.speed;
    } else if (isKeyDown(KeyA)) {
      this.velocity.x = -Paddle.speed;
    } else {
      this.velocity.x = 0;
    }

    if (this.pos.x < 0) {
      this.pos.x = 0;
    }

    if (this.pos.x > getScreenWidth()) {
      this.pos.x = getScreenWidth();
    }
  }

  override render(): void {
    drawRectangle({
      color: Black,
      height: Paddle.height,
      width: Paddle.width,
      posX: this.pos.x - Paddle.width / 2,
      posY: this.pos.y - Paddle.height / 2,
    });
  }
}
