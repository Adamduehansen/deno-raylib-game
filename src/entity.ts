import { type Color } from "../raylib-bindings.ts";
import { EventEmitter } from "./event-emitter.ts";
import { Renderer, TextRenderer } from "./renderer.ts";
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
  radius?: number;
  body?: Body;
  renderer: Renderer<Entity>;
}

let currentEntityId = 1;

/**
 * TODO: Can some of the properties of entity be set to 'readonly'?
 */

export abstract class Entity {
  id: number;
  pos: Vector;
  velocity: Vector;
  height: number;
  width: number;

  name?: string;
  scene?: Scene;

  #body?: Body;

  readonly renderer: Renderer<Entity>;

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

    // Width and height are set to the radius if given.
    this.width = args.radius ?? args.width ?? 0;
    this.height = args.radius ?? args.height ?? 0;

    this.renderer = args.renderer;
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

  render(): void {
    this.renderer.render(this);
  }
}

interface TextOptions {
  color: Color;
  fontSize: number;
  pos: Vector;
}

export class Text extends Entity {
  text: string;
  readonly fontSize: number;

  constructor(text: string, options: TextOptions) {
    super({
      pos: options.pos,
      renderer: new TextRenderer(options.color),
    });
    this.text = text;
    this.fontSize = options.fontSize;
  }
}
