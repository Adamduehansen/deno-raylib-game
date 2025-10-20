import { Entity } from "./entity.ts";
import { EventEmitter } from "./event-emitter.ts";

export abstract class Scene {
  #entities: Entity[] = [];
  eventEmitter: EventEmitter = new EventEmitter();

  add(entity: Entity): void {
    entity.scene = this;
    entity.initialize();
    this.#entities.push(entity);
  }

  update(): void {
    for (const entity of this.#entities) {
      entity.update();
    }
  }

  render(): void {
    for (const entity of this.#entities) {
      entity.render();
    }
  }
}
