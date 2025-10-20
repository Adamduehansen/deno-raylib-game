import { type Color, drawText } from "../raylib-bindings.ts";
import { type Vector } from "./math.ts";
import { Scene } from "./scene.ts";

interface EntityArgs {
  pos: Vector;
}

export abstract class Entity {
  pos: Vector;
  scene?: Scene;

  constructor(args: EntityArgs) {
    this.pos = args.pos;
  }

  update(): void {}

  initialize(): void {}

  abstract render(): void;
}

interface TextOptions {
  color: Color;
  fontSize: number;
  pos: Vector;
}

export class Text extends Entity {
  readonly text: string;
  readonly color: Color;
  readonly fontSize: number;

  constructor(text: string, options: TextOptions) {
    super({
      pos: options.pos,
    });
    this.text = text;
    this.color = options.color;
    this.fontSize = options.fontSize;
  }

  override render(): void {
    drawText({
      text: this.text,
      color: this.color,
      fontSize: this.fontSize,
      posX: this.pos.x,
      posY: this.pos.y,
    });
  }
}
