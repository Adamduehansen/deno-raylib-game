import { vec } from "./math.ts";
import { Green, Vector } from "./r-core.ts";
import { drawRectangleLinesEx } from "./r-shapes.ts";

export default abstract class Body {
  protected position: Vector = vec(0, 0);

  abstract update(position: Vector): void;
  abstract render(): void;
}

export class RectangleBody extends Body {
  constructor(readonly width: number, readonly height: number) {
    super();
  }

  update(position: Vector): void {
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
  }
}
