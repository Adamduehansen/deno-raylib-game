import {
  type Color,
  drawTextEx,
  getFontDefault,
  measureText,
} from "../raylib-bindings.ts";
import { EventEmitter } from "./event-emitter.ts";
import { vec, type Vector } from "./math.ts";
import { Body } from "./physics.ts";
import { Scene } from "./scene.ts";

export interface Event {
  scene: Scene;
}

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

  eventEmitter = new EventEmitter();

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
  }

  remove(): void {
    this.scene?.entityManager.remove(this);
  }

  initialize(): void {}

  // deno-lint-ignore no-unused-vars
  onCollision(other: Entity): void {}

  /**
   * Called when an entity is destroyed.
   */
  // deno-lint-ignore no-unused-vars
  onDestroyed(event: Event) {}

  abstract render(): void;
}

interface TextOptions {
  color: Color;
  fontSize: number;
  pos: Vector;
}

export class Text extends Entity {
  text: string;
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
    const textLength = measureText(this.text, 48);
    drawTextEx({
      text: this.text,
      tint: this.color,
      fontSize: this.fontSize,
      spacing: 5,
      font: getFontDefault(),
      position: {
        x: this.pos.x - textLength / 2,
        y: this.pos.y,
      },
    });
  }
}
