import {
  beginDrawing,
  clearBackground,
  closeWindow,
  endDrawing,
  initWindow,
  RayWhite,
  setTargetFPS,
  windowShouldClose,
} from "./r-core.ts";
import { drawFPS } from "./r-text.ts";
import { ResourceManager } from "./resource.ts";

interface GameArgs {
  title: string;
  height: number;
  width: number;
  fps: number;
  resourceManager: ResourceManager;
  // scenes: Record<string, Scene>;
  // initialScene: string;
}

export default class Game {
  private _title: string;
  private _width: number;
  private _height: number;
  private _fps: number;
  private _resourceManager: ResourceManager;

  constructor(args: GameArgs) {
    this._title = args.title;
    this._width = args.width;
    this._height = args.height;
    this._fps = args.fps;
    this._resourceManager = args.resourceManager;
  }

  initialize(): void {
    initWindow({
      title: this._title,
      height: this._height,
      width: this._width,
    });

    setTargetFPS(this._fps);

    this._resourceManager.load();
  }

  run(): void {
    while (windowShouldClose() === false) {
      // Update
      // ======================================================================

      // Render
      // ======================================================================
      beginDrawing();
      clearBackground(RayWhite);
      drawFPS(0, 0);
      endDrawing();
    }
  }

  close(): void {
    this._resourceManager.unload();

    closeWindow();
  }
}
