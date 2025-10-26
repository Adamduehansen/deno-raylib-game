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

export class Paddle extends Entity {
  static width = 80;
  static height = 20;

  constructor() {
    super({
      pos: {
        x: getScreenWidth() / 2 - Paddle.width / 2,
        y: Math.floor(getScreenHeight() * 7 / 8),
      },
      width: Paddle.width,
      height: Paddle.height,
      name: "paddle",
    });
  }

  override update(): void {
    super.update();
    if (isKeyDown(KeyD)) {
      this.pos.x += 5;
    }
    if (this.pos.x < 0) {
      this.pos.x = 0;
    }

    if (isKeyDown(KeyA)) {
      this.pos.x -= 5;
    }
    if (this.pos.x + Paddle.width > getScreenWidth()) {
      this.pos.x = getScreenWidth() - Paddle.width;
    }
  }

  override render(): void {
    drawRectangle({
      color: Black,
      height: Paddle.height,
      width: Paddle.width,
      posX: this.pos.x,
      posY: this.pos.y,
    });
  }
}
