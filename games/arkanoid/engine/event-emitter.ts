type EventMap = Record<string, ((data?: unknown) => void)[]>;

export class EventEmitter {
  #eventMap: EventMap = {};

  emit(event: string, data?: unknown) {
    if (this.#eventMap[event] === undefined) {
      return;
    }

    for (const handler of this.#eventMap[event]) {
      handler(data);
    }
  }

  on(event: string, handler: (data: unknown) => void) {
    if (this.#eventMap[event] === undefined) {
      this.#eventMap[event] = [];
    }

    this.#eventMap[event].push(handler);
  }
}
