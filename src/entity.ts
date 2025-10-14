import { type Color, drawText } from "../raylib-bindings.ts";
import { type Vector } from "./math.ts";

export abstract class Entity {
  abstract render(): void;
}

interface TextOptions {
  color: Color;
  fontSize: number;
  pos: Vector;
}

export class Text extends Entity {
  readonly text: string;
  readonly options: TextOptions;

  constructor(text: string, options: TextOptions) {
    super();
    this.text = text;
    this.options = options;
  }

  override render(): void {
    drawText({
      text: this.text,
      color: this.options.color,
      fontSize: this.options.fontSize,
      posX: this.options.pos.x,
      posY: this.options.pos.y,
    });
  }
}
