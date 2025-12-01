import {
  beginDrawing,
  Black,
  clearBackground,
  closeWindow,
  endDrawing,
  initWindow,
  setTargetFPS,
  windowShouldClose,
} from "@src/r-core.ts";
import ResourceManager, { TextureResource } from "./resource-manager.ts";
import { LevelManager } from "./level.ts";
import { drawFPS } from "@src/r-text.ts";

const screenWidth = 800;
const screenHeight = 450;

initWindow({
  title: "Dungeon Explorer",
  width: screenWidth,
  height: screenHeight,
});

setTargetFPS(60);

ResourceManager.getInstance().load(
  "spritesheet",
  new TextureResource("./games/dungeon-explorer/spritesheet.png"),
);

const levelManager = new LevelManager();

while (windowShouldClose() === false) {
  // Update
  // --------------------------------------------------------------------------
  levelManager.currentLevel.update();

  // Draw
  // --------------------------------------------------------------------------
  beginDrawing();

  clearBackground(Black);

  drawFPS(0, 0);

  levelManager.currentLevel.render();

  endDrawing();
}

ResourceManager.getInstance().unload();

closeWindow();
