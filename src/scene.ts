import { checkCollisionRecs, Rectangle } from "../raylib-bindings.ts";
import { Entity } from "./entity.ts";
import { EventEmitter } from "./event-emitter.ts";

class EntityManager {
  #entities: Entity[] = [];
  #scene: Scene;

  get entities(): readonly Entity[] {
    return this.#entities;
  }

  constructor(scene: Scene) {
    this.#scene = scene;
  }

  add(entity: Entity): void {
    entity.scene = this.#scene;
    entity.initialize();
    this.#entities.push(entity);
  }

  getByName(name: string): readonly Entity[] {
    return this.#entities.filter((entity) => entity.name === name);
  }

  query(predicate: (entity: Entity) => boolean): readonly Entity[] {
    return this.#entities.filter(predicate);
  }

  remove(entityToRemove: Entity): void {
    this.#entities = this.#entities.filter((entity) =>
      entity.id !== entityToRemove.id
    );
  }
}

export abstract class Scene {
  readonly entityManager: EntityManager = new EntityManager(this);

  eventEmitter: EventEmitter = new EventEmitter();

  update(): void {
    for (const entity of this.entityManager.entities) {
      entity.update();
    }

    for (const entity of this.entityManager.entities) {
      this.#checkCollisionWithOtherEntities(entity);
    }
  }

  render(): void {
    for (const entity of this.entityManager.entities) {
      entity.render();
      entity.body?.render();
    }
  }

  #checkCollisionWithOtherEntities(entity: Entity) {
    for (const other of this.entityManager.entities) {
      if (
        other.id === entity.id || entity.body === undefined ||
        other.body === undefined
      ) {
        continue;
      }

      // TODO: use Raylib to check collision with other entity.
      if (
        checkCollisionRecs(
          entity.body.getCollider() as Rectangle,
          other.body.getCollider() as Rectangle,
        )
      ) {
        entity.eventEmitter.emit("collision");
      }
    }
  }
}
