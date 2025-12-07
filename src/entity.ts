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

  // Graphic stuff
  // --------------------------------------------------------------------------
  private _graphicsMap = new Map<string, Graphic>();
  private _currentGraphicKey = "";

  addGraphic(key: string, graphic: Graphic): void {
    this._graphicsMap.set(key, graphic);
  }

  useGraphic(key: string): void {
    this._currentGraphicKey = key;
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

  // deno-lint-ignore no-unused-vars
  update(game: Game): void {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  render(): void {
    const currentGraphic = this._graphicsMap.get(this._currentGraphicKey);
    if (currentGraphic === undefined) {
      return;
    }

    currentGraphic.render(this.position);
  }
}
