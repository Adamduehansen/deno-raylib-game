import Entity from "./entity.ts";
import Game from "./game.ts";
import {
  beginDrawing,
  beginMode2D,
  Camera,
  clearBackground,
  endDrawing,
  endMode2D,
  RayWhite,
} from "./r-core.ts";
import { drawFPS } from "./r-text.ts";

class EntityManager {
  private _entities: Entity[] = [];
  private _scene: Scene;

  get entities(): readonly Entity[] {
    return this._entities;
  }

  constructor(scene: Scene) {
    this._scene = scene;
  }

  add(entity: Entity): void {
    this._entities.push(entity);
    entity.onInitialize(this._scene);
  }

  clear(): void {
    for (const entity of this._entities) {
      this.remove(entity);
    }
  }

  getByName(name: string): readonly Entity[] {
    return this._entities.filter((entity) => entity.name === name);
  }

  query(predicate: (entity: Entity) => boolean): readonly Entity[] {
    return this._entities.filter(predicate);
  }

  remove(entityToRemove: Entity | undefined): void {
    if (entityToRemove === undefined) {
      return;
    }

    this._entities = this._entities.filter((entity) =>
      entity.id !== entityToRemove.id
    );
    entityToRemove.onRemoved(this._scene);
  }
}

const DefaultCamera: Camera = {
  target: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  rotation: 0,
  zoom: 1,
};

export default abstract class Scene {
  protected entityManager = new EntityManager(this);
  protected camera = DefaultCamera;

  /**
   * Called once when the scene is added to the game. USe this to setup entities
   * that needs to live across scene changes.
   *
   * @param game the current instance of the game.
   */
  // deno-lint-ignore no-unused-vars
  onInitialize(game: Game): void {}

  /**
   * Called when a scene is switched to. Use this method to setup the entities
   * of the scene.
   */
  onActivate(): void {}

  /**
   * Called on each tick of the game.
   *
   * @param game the current instance of the game.
   */
  // deno-lint-ignore no-unused-vars
  onUpdate(game: Game): void {
  }

  /**
   * Called on each tick of the game.
   */
  onRender(): void {
    beginDrawing();
    clearBackground(RayWhite);

    beginMode2D(this.camera);
    for (const entity of this.entityManager.entities) {
      entity.render();
    }
    endMode2D();

    drawFPS(0, 0);
    endDrawing();
  }
}
