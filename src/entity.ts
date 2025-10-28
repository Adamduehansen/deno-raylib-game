import { type Color, drawText } from "../raylib-bindings.ts";
import { vec, type Vector } from "./math.ts";
import { Body } from "./physics.ts";
import { Scene } from "./scene.ts";

interface EntityArgs {
  pos: Vector;
  name?: string;
  width?: number;
  height?: number;
  body?: Body;
}

let currentEntityId = 1;

export abstract class Entity {
  id: number;
  pos: Vector;
  velocity: Vector;
  height: number;
  width: number;

  name?: string;
  scene?: Scene;

  #body?: Body;

  get body(): Body | undefined {
    return this.#body;
  }

  constructor(args: EntityArgs) {
    this.pos = args.pos;
    this.velocity = vec(0, 0);
    this.#body = args.body;
    this.name = args.name ?? undefined;
    this.id = currentEntityId++;
    this.width = args.width ?? 0;
    this.height = args.height ?? 0;
  }

  update(): void {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
    this.#body?.update(this.pos);
  }

  remove(): void {
    this.scene?.entityManager.remove(this);
  }

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
