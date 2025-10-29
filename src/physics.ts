import {
  drawCircleLinesV,
  drawRectangleLinesEx,
  Green,
  Rectangle,
} from "../raylib-bindings.ts";
import { vec, Vector } from "./math.ts";

interface Circle {
  vector: Vector;
  radius: number;
}

type ColliderType = Rectangle | Circle;

export abstract class Body {
  pos: Vector = vec(0, 0);

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

class RectangleBody extends Body {
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
  }

  override getCollider(): Rectangle {
    return {
      x: this.pos.x,
      y: this.pos.y,
      height: this.height,
      width: this.width,
    };
  }
}

class CircleBody extends Body {
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
  }

  override getCollider(): Circle {
    return {
      radius: this.radius,
      vector: this.pos,
    };
  }
}
