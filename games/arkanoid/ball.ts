import { Entity } from "@src/entity.ts";
import { drawCircleV, getScreenWidth, Maroon } from "../../raylib-bindings.ts";
import { Paddle } from "./paddle.ts";
import { Body } from "@src/physics.ts";
import { Brick } from "./brick.ts";

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
    this.body!.collisionType = "active";
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

      other.remove();
    }
  }

  override update(): void {
    super.update();

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
    }
  }
}
