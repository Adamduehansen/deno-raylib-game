import { Entity } from "@src/entity.ts";
import { drawCircleV, getScreenWidth, Maroon } from "../../raylib-bindings.ts";
import { Paddle } from "./paddle.ts";
import { Body } from "@src/physics.ts";

export class Ball extends Entity {
  static radius = 7;

  #paddle: Paddle;
  #active: boolean = false;

  constructor(paddle: Paddle) {
    super({
      pos: {
        x: 0,
        y: 0,
      },
      height: Ball.radius,
      width: Ball.radius,
      name: "ball",
      body: Body.Circle(Ball.radius),
    });
    this.#paddle = paddle;
  }

  override initialize(): void {
    this.scene?.eventEmitter.on("activate", () => {
      this.#active = true;
      this.velocity.y = -5;
    });
  }

  override render(): void {
    drawCircleV({
      center: {
        x: this.pos.x,
        y: this.pos.y,
      },
      color: Maroon,
      radius: Ball.radius,
    });
  }

  override onCollision(other: Entity): void {
    if (other.name === "paddle") {
      this.velocity.y *= -1;
      this.velocity.x = (this.pos.x - this.#paddle.pos.x) / 5;
    }
  }

  override update(): void {
    super.update();

    // Update ball position.
    if (this.#active === false) {
      this.pos.x = this.#paddle.pos.x;
      this.pos.y = this.#paddle.pos.y - 20;
    }

    // // Check collision with top
    if (this.pos.y < 0 + Ball.radius / 2) {
      this.velocity.y *= -1;
    }

    // // Check collision with walls
    if (this.pos.x < 0 || this.pos.x > getScreenWidth()) {
      this.velocity.x *= -1;
    }

    // // Check collision with any brick
    // const bricks = this.scene?.entityManager.getByName("brick") ?? [];
    // for (const brick of bricks) {
    //   if (!checkCollisionCircleRec(this.pos, Ball.radius, brick.body)) {
    //     continue;
    //   }

    //   this.velocity.y *= -1;
    //   brick.remove();
    // }
  }
}
