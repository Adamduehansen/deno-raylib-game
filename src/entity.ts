import Body, { RectangleBody } from "./body.ts";
import Game from "./game.ts";
import Graphic, { Rectangle } from "./graphics.ts";
import { vec } from "./math.ts";
import { Blank, Color, Vector } from "./r-core.ts";
import { checkCollisionRecs } from "./r-shapes.ts";
import Scene from "./scene.ts";

let entityIdentifier = 0;

interface EntityArgs {
  width?: number;
  height?: number;
  position?: Vector;
  color?: Color;
  body?: Body;
}

export default class Entity {
  readonly id = entityIdentifier++;
  readonly name?: string;

  readonly width: number;
  readonly height: number;

  velocity = vec(0, 0);
  position: Vector;
  color: Color;

  body: Body;

  // Graphic stuff
  // --------------------------------------------------------------------------
  protected graphicsMap = new Map<string, Graphic>();
  protected currentGraphicKey = "";

  get currentGraphic(): Graphic | undefined {
    return this.graphicsMap.get(this.currentGraphicKey);
  }

  constructor(args?: EntityArgs) {
    this.width = args?.width ?? 0;
    this.height = args?.height ?? 0;
    this.position = args?.position ?? vec(0, 0);
    this.color = args?.color ?? Blank;
    this.body = args?.body ?? new RectangleBody(this.width, this.height);

    this.useGraphic(new Rectangle(this.width, this.height));
  }

  addGraphic(key: string, graphic: Graphic): void {
    this.graphicsMap.set(key, graphic);
  }

  useGraphic(graphic: Graphic): void;
  useGraphic(key: string): void;
  useGraphic(value: string | Graphic): void {
    if (typeof value === "string") {
      this.currentGraphicKey = value;
    } else {
      this.graphicsMap.clear();
      this.graphicsMap.set("default", value);
      this.useGraphic("default");
    }
  }
  // --------------------------------------------------------------------------

  /**
   * Called once the entity is added to a scene.
   *
   * @param scene The scene the entity is initialized to.
   */
  // deno-lint-ignore no-unused-vars
  onInitialize(scene: Scene): void {}

  /**
   * Called when the entity is removed from a scene.
   *
   * @param scene The scene the entity is removed from.
   */
  // deno-lint-ignore no-unused-vars
  onRemoved(scene: Scene): void {}

  /**
   * Called when the collision starts.
   */
  // deno-lint-ignore no-unused-vars
  onCollisionStart(scene: Scene): void {}

  /**
   * Called when the collision ends.
   */
  // deno-lint-ignore no-unused-vars
  onCollisionEnd(scene: Scene): void {}

  // deno-lint-ignore no-unused-vars
  update(scene: Scene, game: Game): void {
    // Calculate new position
    const _oldX = this.position.x;
    const _oldY = this.position.y;

    const newX = this.position.x + this.velocity.x;
    const newY = this.position.y + this.velocity.y;

    // Check for collision
    for (const other of scene.entityManager.entities) {
      if (this.id === other.id) {
        continue;
      }

      if (this.body === null || other.body === null) {
        continue;
      }

      if ((this.body instanceof RectangleBody) === false) {
        continue;
      }

      if ((other.body instanceof RectangleBody) === false) {
        continue;
      }

      if (other.body.collisionType === "prevent") {
        continue;
      }

      if (this.body.collisionType === "prevent") {
        continue;
      }

      const newBody = this.body.clone();
      newBody.x = newX - newBody.width / 2;
      newBody.y = newY - newBody.height / 2;

      if (checkCollisionRecs(newBody, other.body.getBounds())) {
        this.onCollisionStart(scene);
        break;
      }
    }

    this.position = vec(newX, newY);

    // Post update
    if (this.body !== null) {
      this.body.update(this.position);
    }
  }

  // deno-lint-ignore no-unused-vars
  render(scene: Scene, game: Game): void {
    const currentGraphic = this.graphicsMap.get(this.currentGraphicKey);
    if (currentGraphic === undefined) {
      return;
    }

    currentGraphic.render(this.position);

    // Post draw
    if (game.debug && this.body !== null) {
      this.body.render();
    }
  }
}
