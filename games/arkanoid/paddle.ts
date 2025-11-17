import { Entity } from "@src/entity.ts";
import { Black, isKeyDown, KeyA, KeyD } from "../../raylib-bindings.ts";
import { Body } from "@src/physics.ts";
import { vec } from "@src/math.ts";
import { RectangleRenderer } from "@src/renderer.ts";

export class Paddle extends Entity {
  static width = 80;
  static height = 20;
  static speed = 5;

  #paused = false;

  constructor() {
    super({
      pos: vec(0, 0),
      width: Paddle.width,
      height: Paddle.height,
      name: "paddle",
      body: Body.rectangle(Paddle.width, Paddle.height),
      renderer: new RectangleRenderer(Black),
    });
  }

  override initialize(): void {
    this.pos = vec(
      this.scene!.game!.width / 2,
      Math.floor(this.scene!.game!.height * 7 / 8),
    );

    this.scene?.eventEmitter.on("pause", (paused) => {
      if (typeof paused !== "boolean") {
        return;
      }

      this.#paused = paused;
    });
  }

  override update(): void {
    super.update();

    if (this.#paused === true) {
      this.velocity = vec(0, 0);
    } else {
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

      if (this.pos.x > this.scene!.game!.width) {
        this.pos.x = this.scene!.game!.width;
      }
    }
  }
}
