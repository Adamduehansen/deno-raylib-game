import Game from "@src/game.ts";
import { ResourceManager } from "@src/resource.ts";
import { Resources } from "./resources.ts";

const screenWidth = 800;
const screenHeight = 450;

const game = new Game({
  title: "Dungeon Explorer",
  width: screenWidth,
  height: screenHeight,
  fps: 60,
  resourceManager: new ResourceManager(Object.values(Resources)),
});

game.initialize();

game.run();

game.close();
