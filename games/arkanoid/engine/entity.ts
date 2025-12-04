import { EventEmitter } from "./event-emitter.ts";
import { Renderer, TextRenderer } from "./renderer.ts";
import { Body } from "./physics.ts";
import { Scene } from "./scene.ts";
import { Color, Vector } from "@src/r-core.ts";
import { vec } from "@src/r-math.ts";

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
  readonly id: number;
  readonly height: number;
  readonly width: number;
  readonly renderer: Renderer<Entity>;
  readonly name?: string;

  #body?: Body;
  pos: Vector;
  velocity: Vector;

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

  update(_scene: Scene): void {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
  }

  /**
   * Called once when the entity is added to the scene.
   */
  // deno-lint-ignore no-unused-vars
  initialize(scene: Scene): void {}

  // deno-lint-ignore no-unused-vars
  onCollision(other: Entity, scene: Scene): void {}

  /**
   * Called when an entity is destroyed.
   */
  // deno-lint-ignore no-unused-vars
  onDestroyed(scene: Scene) {}

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
  fontSize: number;

  constructor(text: string, options: TextOptions) {
    super({
      pos: options.pos,
      renderer: new TextRenderer(options.color),
    });
    this.text = text;
    this.fontSize = options.fontSize;
  }
}
