import Input from "./input.ts";
import {
  closeWindow,
  getScreenHeight,
  getScreenWidth,
  initWindow,
  setTargetFPS,
  windowShouldClose,
} from "./r-core.ts";
import { ResourceManager } from "./resource.ts";
import Scene from "./scene.ts";

class Window {
  get width(): number {
    return getScreenWidth();
  }

  get height(): number {
    return getScreenHeight();
  }
}

type SceneFactory = Record<string, Scene>;

type SceneKey = keyof SceneFactory;

interface GameArgs {
  title: string;
  height: number;
  width: number;
  fps: number;
  resourceManager: ResourceManager;
  scenes: SceneFactory;
  currentScene: SceneKey;
}

export default class Game {
  private _title: string;
  private _width: number;
  private _height: number;
  private _fps: number;
  private _resourceManager: ResourceManager;
  private _scenes: SceneFactory;
  private _currentScene: Scene;

  readonly window = new Window();
  readonly input = new Input();

  constructor(args: GameArgs) {
    this._title = args.title;
    this._width = args.width;
    this._height = args.height;
    this._fps = args.fps;
    this._resourceManager = args.resourceManager;
    this._scenes = args.scenes;
    this._currentScene = args.scenes[args.currentScene];
  }

  /**
   * Initializes the game.
   */
  initialize(): void {
    initWindow({
      title: this._title,
      height: this._height,
      width: this._width,
    });

    setTargetFPS(this._fps);

    this._resourceManager.load();

    for (const scene of Object.values(this._scenes)) {
      scene.onInitialize(this);
    }
  }

  /**
   * Run the game. This will run until a close condition is hit.
   */
  run(): void {
    while (windowShouldClose() === false) {
      // Update
      // ======================================================================
      this._currentScene.onUpdate(this);

      // Render
      // ======================================================================
      this._currentScene.onRender();
    }
  }

  /**
   * Closes the game.
   */
  close(): void {
    this._resourceManager.unload();

    closeWindow();
  }
}
