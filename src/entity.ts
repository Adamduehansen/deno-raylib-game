import Body, { RectangleBody } from "./body.ts";
import Game from "./game.ts";
import Graphic from "./graphics.ts";
import { vec } from "./math.ts";
import { checkCollisionRecs } from "./r-shapes.ts";
import Scene from "./scene.ts";

let entityIdentifier = 0;

export default class Entity {
  readonly id = entityIdentifier++;
  readonly name?: string;

  velocity = vec(0, 0);
  position = vec(0, 0);

  body: Body | null;

  // Graphic stuff
  // --------------------------------------------------------------------------
  protected graphicsMap = new Map<string, Graphic>();
  protected currentGraphicKey = "";

  get currentGraphic(): Graphic | undefined {
    return this.graphicsMap.get(this.currentGraphicKey);
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

  constructor() {
    this.body = new RectangleBody(8, 8);
  }

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

  // deno-lint-ignore no-unused-vars
  update(scene: Scene, game: Game): void {
    // Calculate new position
    const oldX = this.position.x;
    const oldY = this.position.y;

    const newX = this.position.x + this.velocity.x;
    const newY = this.position.y + this.velocity.y;

    let updatePosition = true;

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

      const newBody = this.body.clone();
      newBody.x = newX - newBody.width / 2;
      newBody.y = newY - newBody.height / 2;

      if (checkCollisionRecs(newBody, other.body.getBounds())) {
        updatePosition = false;
        break;
      }
    }

    if (updatePosition) {
      this.position = vec(newX, newY);
    } else {
      this.position = vec(oldX, oldY);
    }

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
