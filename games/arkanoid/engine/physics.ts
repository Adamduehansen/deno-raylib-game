import {
  drawCircleLinesV,
  drawCircleV,
  drawRectangleLinesEx,
  Green,
  Rectangle,
  Red,
} from "@src/raylib-bindings.ts";
import { vec, Vector } from "@src/math.ts";

interface Circle {
  vector: Vector;
  radius: number;
}

type ColliderType = Rectangle | Circle;

type CollisionType = "passive" | "active";

export abstract class Body {
  pos: Vector = vec(0, 0);
  collisionType: CollisionType = "passive";

  abstract update(pos: Vector): void;
  abstract render(): void;
  abstract getCollider(): ColliderType;

  static rectangle(width: number, height: number): Body {
    return new RectangleBody(width, height);
  }

  static Circle(radius: number): Body {
    return new CircleBody(radius);
  }
}

export class RectangleBody extends Body {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
  }

  override update(pos: Vector): void {
    this.pos = vec(pos.x, pos.y);
  }

  override render(): void {
    drawRectangleLinesEx({
      rec: {
        x: this.pos.x - this.width / 2,
        y: this.pos.y - this.height / 2,
        height: this.height,
        width: this.width,
      },
      color: Green,
      lineThick: 1,
    });
    drawCircleV({
      center: this.pos,
      color: Red,
      radius: 2,
    });
  }

  override getCollider(): Rectangle {
    // The width and the height is subtracted from this.pos since it is the center
    // of the collider.
    return {
      x: this.pos.x - this.width / 2,
      y: this.pos.y - this.height / 2,
      height: this.height,
      width: this.width,
    };
  }
}

export class CircleBody extends Body {
  radius: number;

  constructor(radius: number) {
    super();
    this.radius = radius;
  }

  override update(pos: Vector): void {
    this.pos = vec(pos.x, pos.y);
  }

  override render(): void {
    drawCircleLinesV({
      center: this.pos,
      color: Green,
      radius: this.radius,
    });
    drawCircleV({
      center: this.pos,
      color: Red,
      radius: 2,
    });
  }

  override getCollider(): Circle {
    return {
      radius: this.radius,
      vector: this.pos,
    };
  }
}
