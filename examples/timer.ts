import {
  beginDrawing,
  Black,
  clearBackground,
  closeWindow,
  drawText,
  endDrawing,
  getFrameTime,
  initWindow,
  RayWhite,
  setTargetFPS,
  windowShouldClose,
} from "../raylib-bindings.ts";

type TimerCallback = () => void;

interface TimerOptions {
  ms: number;
  callback: TimerCallback;
  repeat?: boolean;
}

class Timer {
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

initWindow({
  title: "Timer example",
  width: 800,
  height: 450,
});

setTargetFPS(60);

let singleShotCallbacks = 0;
let repeatingCallbacks = 0;

const singleShotTimer = new Timer({
  ms: 1000,
  callback: () => {
    singleShotCallbacks += 1;
  },
});
singleShotTimer.start();

const repeatingTimer = new Timer({
  ms: 1000,
  callback: () => {
    repeatingCallbacks += 1;
  },
  repeat: true,
});
repeatingTimer.start();

while (windowShouldClose() === false) {
  // Update
  // --------------------------------------------------------------------------
  singleShotTimer.update();
  repeatingTimer.update();

  // Draw
  // --------------------------------------------------------------------------
  beginDrawing();
  clearBackground(RayWhite);

  drawText({
    text: `Singleshot ms: ${singleShotTimer.ms}`,
    color: Black,
    fontSize: 24,
    posX: 10,
    posY: 10,
  });

  drawText({
    text: `Singleshot elapsed: ${singleShotTimer.elapsed.toFixed(3)}`,
    color: Black,
    fontSize: 24,
    posX: 10,
    posY: 30,
  });

  drawText({
    text: `Singleshot callbacks: ${singleShotCallbacks}`,
    color: Black,
    fontSize: 24,
    posX: 10,
    posY: 50,
  });

  drawText({
    text: `Repeat ms: ${repeatingTimer.ms}`,
    color: Black,
    fontSize: 24,
    posX: 400,
    posY: 10,
  });

  drawText({
    text: `Repeat elapsed: ${repeatingTimer.elapsed.toFixed(3)}`,
    color: Black,
    fontSize: 24,
    posX: 400,
    posY: 30,
  });

  drawText({
    text: `Repeat callbacks: ${repeatingCallbacks}`,
    color: Black,
    fontSize: 24,
    posX: 400,
    posY: 50,
  });

  endDrawing();
}

closeWindow();
