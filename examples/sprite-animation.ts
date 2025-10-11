import {
  beginDrawing,
  clearBackground,
  closeWindow,
  drawTextureRec,
  endDrawing,
  getFrameTime,
  initWindow,
  loadTexture,
  RayWhite,
  setTargetFPS,
  White,
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

let animationFrame = 0;
const animationTimer = new Timer({
  ms: 250,
  callback: () => {
    if (animationFrame >= 5) {
      animationFrame = 0;
    } else {
      animationFrame += 1;
    }
  },
  repeat: true,
});
animationTimer.start();

initWindow({
  title: "Animation example",
  height: 450,
  width: 800,
});

setTargetFPS(60);

const scarfy = loadTexture("./examples/resources/scarfy.png");

while (windowShouldClose() === false) {
  // Update
  // ==========================================================================
  animationTimer.update();

  // Draw
  // ==========================================================================
  beginDrawing();

  clearBackground(RayWhite);

  drawTextureRec({
    texture: scarfy,
    rectangle: {
      x: animationFrame * 128,
      y: animationFrame * 128,
      height: 128,
      width: 128,
    },
    vector: {
      x: 10,
      y: 10,
    },
    color: White,
  });

  endDrawing();
}

closeWindow();
