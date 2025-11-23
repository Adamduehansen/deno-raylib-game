import { LightGray } from "@src/raylib-bindings.ts";
import { Entity } from "./engine/entity.ts";
import { Vector } from "@src/math.ts";
import { RectangleRenderer } from "./engine/renderer.ts";

const WIDTH = 40;
const HEIGHT = 10;

interface Args {
  pos: Vector;
}

export class Life extends Entity {
  constructor({ pos }: Args) {
    super({
      pos: pos,
      height: HEIGHT,
      width: WIDTH,
      name: "life",
      renderer: new RectangleRenderer(LightGray),
    });
  }
}
