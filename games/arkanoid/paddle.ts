import { Entity } from "./engine/entity.ts";
import { Black, isKeyDown, KeyA, KeyD } from "@src/raylib-bindings.ts";
import { Body } from "./engine/physics.ts";
import { vec } from "@src/math.ts";
import { RectangleRenderer } from "./engine/renderer.ts";
import { Scene } from "./engine/scene.ts";
import { GAME_HEIGHT, GAME_WIDTH } from "./consts.ts";

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

  override initialize(scene: Scene): void {
    this.pos = vec(
      GAME_WIDTH / 2,
      Math.floor(GAME_HEIGHT * 7 / 8),
    );

    scene.eventEmitter.on("pause", (paused) => {
      if (typeof paused !== "boolean") {
        return;
      }

      this.#paused = paused;
    });
  }

  override update(scene: Scene): void {
    super.update(scene);

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

      if (this.pos.x > GAME_WIDTH) {
        this.pos.x = GAME_WIDTH;
      }
    }
  }
}
