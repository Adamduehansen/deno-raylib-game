import { Entity } from "./engine/entity.ts";
import {
  getScreenHeight,
  getScreenWidth,
  Maroon,
} from "@src/raylib-bindings.ts";
import { Paddle } from "./paddle.ts";
import { Body } from "./engine/physics.ts";
import { Brick } from "./brick.ts";
import { CircleRenderer } from "./engine/renderer.ts";
import { Scene } from "./engine/scene.ts";

export class Ball extends Entity {
  static radius = 7;

  #paddle: Paddle;
  #active: boolean = false;
  #paused = false;

  constructor(paddle: Paddle) {
    super({
      pos: {
        x: 0,
        y: 0,
      },
      radius: Ball.radius,
      name: "ball",
      body: Body.Circle(Ball.radius),
      renderer: new CircleRenderer(Maroon),
    });
    this.body!.collisionType = "active";
    this.#paddle = paddle;
  }

  override initialize(scene: Scene): void {
    scene.eventEmitter.on("activate", () => {
      this.#active = true;
      this.velocity.y = -5;
    });

    scene.eventEmitter.on("pause", () => {
      this.#paused = !this.#paused;
    });
  }

  override onCollision(other: Entity, scene: Scene): void {
    if (other.name === "paddle") {
      this.velocity.y *= -1;
      this.velocity.x = (this.pos.x - this.#paddle.pos.x) / 5;
    } else if (other.name === "brick") {
      if (
        (this.pos.y > other.pos.y || this.pos.y < other.pos.y) &&
        this.pos.x - Brick.size / 2 < other.pos.x &&
        this.pos.x + Brick.size / 2 > other.pos.x
      ) {
        this.velocity.y *= -1;
      }

      if (
        (this.pos.x > other.pos.x || this.pos.x < other.pos.x) &&
        this.pos.y - Brick.size / 2 < other.pos.y &&
        this.pos.y + Brick.size / 2 > other.pos.y
      ) {
        this.velocity.x *= -1;
      }

      scene.entityManager.remove(other);
    }
  }

  override update(scene: Scene): void {
    super.update(scene);

    // Update ball position.
    if (this.#active === false) {
      this.pos.x = this.#paddle.pos.x;
      this.pos.y = this.#paddle.pos.y - 20;
    }

    // Check collision with top
    if (this.pos.y < 0 + Ball.radius / 2) {
      this.velocity.y *= -1;
    } // Check collision with walls
    else if (this.pos.x < 0 || this.pos.x > getScreenWidth()) {
      this.velocity.x *= -1;
    } else if (this.pos.y > getScreenHeight()) {
      this.#active = false;
      this.velocity.x = 0;
      scene.eventEmitter.emit("decreaseLife");
    }
  }
}
