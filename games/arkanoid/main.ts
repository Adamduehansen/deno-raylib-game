import { Scene } from "@src/scene.ts";
import {
  beginDrawing,
  clearBackground,
  closeWindow,
  drawFPS,
  endDrawing,
  initWindow,
  RayWhite,
  setTargetFPS,
  windowShouldClose,
} from "../../raylib-bindings.ts";
import { GameScene } from "./game-scene.ts";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 450;

initWindow({
  title: "Arkanoid",
  height: GAME_HEIGHT,
  width: GAME_WIDTH,
});

setTargetFPS(60);

class GameOverScene extends Scene {}

const gameScene = new GameScene();
const gameOverScene = new GameOverScene();
const scenes = {
  gameScene,
  gameOverScene,
};
const currentScene: keyof typeof scenes = "gameScene";

while (windowShouldClose() === false) {
  // Update
  // ==========================================================================
  scenes[currentScene].update();

  // Render
  // ==========================================================================
  beginDrawing();
  clearBackground(RayWhite);
  scenes[currentScene].render();
  drawFPS(0, 0);
  endDrawing();
}

closeWindow();
