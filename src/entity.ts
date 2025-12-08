import Body, { RectangleBody } from "./body.ts";
import Game from "./game.ts";
import Graphic from "./graphics.ts";
import { vec } from "./math.ts";
import Scene from "./scene.ts";

let entityIdentifier = 0;

export default abstract class Entity {
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

  useGraphic(key: string): void {
    this.currentGraphicKey = key;
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
  update(game: Game): void {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Post update
    if (this.body !== null) {
      this.body.update(this.position);
    }
  }

  // deno-lint-ignore no-unused-vars
  render(scene: Scene): void {
    const currentGraphic = this.graphicsMap.get(this.currentGraphicKey);
    if (currentGraphic === undefined) {
      return;
    }

    currentGraphic.render(this.position);

    // Post draw
    if (this.body !== null) {
      this.body.render();
    }
  }
}
