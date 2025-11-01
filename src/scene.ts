import {
  checkCollisionCircleRec,
  checkCollisionRecs,
} from "../raylib-bindings.ts";
import { Entity } from "./entity.ts";
import { EventEmitter } from "./event-emitter.ts";
import { CircleBody, RectangleBody } from "./physics.ts";

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
      // TODO: Update of body should happen inside Entity.
      entity.body?.update(entity.pos);
    }

    for (const entity of this.entityManager.entities) {
      this.#checkCollisionWithOtherEntities(entity);
    }
  }

  render(): void {
    for (const entity of this.entityManager.entities) {
      entity.render();
      // TODO: Render of body should happen inside Entity.
      entity.body?.render();
    }
  }

  #checkCollisionWithOtherEntities(entity: Entity) {
    if (entity.body?.collisionType === "passive") {
      return;
    }

    for (const other of this.entityManager.entities) {
      if (other.id === entity.id) {
        continue;
      }

      if (
        (
          // Rect on rect collision
          entity.body instanceof RectangleBody &&
          other.body instanceof RectangleBody &&
          checkCollisionRecs(
            entity.body.getCollider(),
            other.body.getCollider(),
          )
        ) || (
          // Rect on circle collision
          entity.body instanceof RectangleBody &&
          other.body instanceof CircleBody &&
          checkCollisionCircleRec(
            other.body.getCollider().vector,
            other.body.getCollider().radius,
            entity.body.getCollider(),
          )
        ) || (
          // Circle on rect collision
          entity.body instanceof CircleBody &&
          other.body instanceof RectangleBody &&
          checkCollisionCircleRec(
            entity.body.getCollider().vector,
            entity.body.getCollider().radius,
            other.body.getCollider(),
          )
        )
      ) {
        entity.onCollision(other);
      }
    }
  }
}
