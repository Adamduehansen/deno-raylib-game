import { getFrameTime } from "./raylib-bindings.ts";

type TimerCallback = () => void;

interface TimerOptions {
  ms: number;
  callback: TimerCallback;
  repeat?: boolean;
}

export class Timer {
  /**
   * The amount of milliseconds.
   */
  readonly ms: number;

  /**
   * The amount of milliseconds that has passed since the timer was activated.
   */
  get elapsed(): number {
    return this.#elapsed;
  }

  #elapsed: number = 0;
  #running: boolean = false;

  #callback: TimerCallback;
  #repeat: boolean;

  constructor(options: TimerOptions) {
    this.ms = options.ms;
    this.#callback = options.callback;
    this.#repeat = options.repeat ?? false;
  }

  start(): void {
    this.#running = true;
  }

  update(): void {
    if (this.#running === false) {
      return;
    }

    const frameTimeInMs = getFrameTime() * 1000;
    this.#elapsed += frameTimeInMs;

    if (this.#elapsed > this.ms) {
      if (this.#repeat === false) {
        this.#running = false;
      } else {
        this.#elapsed = 0;
      }
      this.#callback();
    }
  }
}
