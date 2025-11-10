import {
  beginDrawing,
  clearBackground,
  closeWindow,
  drawFPS,
  endDrawing,
  getScreenHeight,
  getScreenWidth,
  initWindow,
  RayWhite,
  setTargetFPS,
  windowShouldClose,
} from "../raylib-bindings.ts";
import { Scene } from "./scene.ts";

interface GameArgs {
  title: string;
  height: number;
  width: number;
  fps: number;
  scenes: Record<string, Scene>;
  initialScene: string;
}

export class Game {
  #scenes: Record<string, Scene>;
  #currentScene: string;

  get width(): number {
    return getScreenWidth();
  }

  get height(): number {
    return getScreenHeight();
  }

  constructor(args: GameArgs) {
    initWindow({
      title: args.title,
      height: args.height,
      width: args.width,
    });

    setTargetFPS(60);

    this.#scenes = args.scenes;
    this.#currentScene = args.initialScene;

    for (const scene of Object.values(this.#scenes)) {
      scene.game = this;
      scene.initialize();
    }
  }

  start(): void {
    while (windowShouldClose() === false) {
      // Update
      // ======================================================================
      this.#scenes[this.#currentScene].update();

      // Render
      // ======================================================================
      beginDrawing();
      clearBackground(RayWhite);
      this.#scenes[this.#currentScene].render();
      drawFPS(0, 0);
      endDrawing();
    }

    closeWindow();
  }

  goToScene(name: string): void {
    this.#currentScene = name;
    this.#scenes[this.#currentScene].activate();
  }
}
