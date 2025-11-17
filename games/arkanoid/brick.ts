import { Entity, Event } from "@src/entity.ts";
import { Vector } from "@src/math.ts";
import { DarkGray, Gray } from "../../raylib-bindings.ts";
import { Body } from "@src/physics.ts";
import { RectangleRenderer } from "@src/renderer.ts";

interface BrickArgs {
  pos: Vector;
  color: typeof Gray | typeof DarkGray;
}

export class Brick extends Entity {
  static size = 40;

  constructor({ pos, color }: BrickArgs) {
    super({
      pos: pos,
      height: Brick.size,
      width: Brick.size,
      name: "brick",
      body: Body.rectangle(Brick.size, Brick.size),
      renderer: new RectangleRenderer(color),
    });
  }

  override onDestroyed(event: Event): void {
    event.scene.eventEmitter.emit("brick-destroyed");
  }
}
