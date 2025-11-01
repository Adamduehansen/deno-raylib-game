import { Entity } from "@src/entity.ts";
import { Vector } from "@src/math.ts";
import {
  Color,
  DarkGray,
  drawRectangleRec,
  Gray,
} from "../../raylib-bindings.ts";
import { Body } from "@src/physics.ts";

interface BrickArgs {
  pos: Vector;
  color: typeof Gray | typeof DarkGray;
}

export class Brick extends Entity {
  readonly color: Color;

  static size = 40;

  constructor({ pos, color }: BrickArgs) {
    super({
      pos: pos,
      height: Brick.size,
      width: Brick.size,
      name: "brick",
      body: Body.rectangle(Brick.size, Brick.size),
    });
    this.color = color;
  }

  override render(): void {
    drawRectangleRec({
      x: this.pos.x - Brick.size / 2,
      y: this.pos.y - Brick.size / 2,
      width: this.width,
      height: this.height,
    }, this.color);
  }
}
