type EventMap = Record<string, (() => void)[]>;

export class EventEmitter {
  #eventMap: EventMap = {};

  emit(event: string) {
    if (this.#eventMap[event] === undefined) {
      return;
    }

    for (const handler of this.#eventMap[event]) {
      handler();
    }
  }

  on(event: string, handler: () => void) {
    if (this.#eventMap[event] === undefined) {
      this.#eventMap[event] = [];
    }

    this.#eventMap[event].push(handler);
  }
}
