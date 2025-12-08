import Entity from "./entity.ts";
import Game from "./game.ts";
import {
  beginDrawing,
  beginMode2D,
  Black,
  Camera,
  clearBackground,
  endDrawing,
  endMode2D,
} from "./r-core.ts";
import { drawFPS } from "./r-text.ts";
import ScreenElement from "./screen-element.ts";

class EntityManager {
  private _entities: Entity[] = [];
  private _screenElements: ScreenElement[] = [];
  private _scene: Scene;

  get entities(): readonly Entity[] {
    return this._entities;
  }

  get screenElements(): readonly ScreenElement[] {
    return this._screenElements;
  }

  constructor(scene: Scene) {
    this._scene = scene;
  }

  add(entity: Entity): void {
    if (entity instanceof ScreenElement) {
      this._screenElements.push(entity);
    } else {
      this._entities.push(entity);
    }

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

  get currentCamera(): Camera {
    return this.camera;
  }

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
   */
  onUpdate(game: Game): void {
    for (const entity of this.entityManager.entities) {
      entity.update(game);
    }
  }

  /**
   * Called on each tick of the game.
   */
  onRender(): void {
    beginDrawing();
    clearBackground(Black);

    beginMode2D(this.camera);
    for (const entity of this.entityManager.entities) {
      entity.render(this);
    }
    endMode2D();

    for (const screenElement of this.entityManager.screenElements) {
      screenElement.render(this);
    }

    drawFPS(0, 0);
    endDrawing();
  }
}
