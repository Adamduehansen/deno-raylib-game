import { vec } from "./math.ts";
import { Green, Red, Vector } from "./r-core.ts";
import {
  drawCircleV,
  drawRectangleLinesEx,
  RaylibRectangle,
} from "./r-shapes.ts";

export default abstract class Body<TBodyType = unknown> {
  protected position: Vector = vec(0, 0);

  collisionType: "prevent" | "passive" | "fixed" | "active" = "prevent";

  abstract clone(): TBodyType;
  abstract update(position: Vector): void;
  abstract render(): void;
  abstract getBounds(): TBodyType;
}

export class RectangleBody extends Body<RaylibRectangle> {
  constructor(readonly width: number, readonly height: number) {
    super();
  }

  override clone(): RaylibRectangle {
    return {
      ...this.getBounds(),
    };
  }

  override getBounds(): RaylibRectangle {
    return {
      ...this.position,
      height: this.height,
      width: this.width,
    };
  }

  override update(position: Vector): void {
    this.position = {
      x: position.x - this.width / 2,
      y: position.y - this.height / 2,
    };
  }

  override render(): void {
    drawRectangleLinesEx({
      color: Green,
      lineThick: 1,
      rec: {
        ...this.position,
        height: this.height,
        width: this.width,
      },
    });
    drawCircleV({
      center: {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height / 2,
      },
      color: Red,
      radius: 1,
    });
  }
}
