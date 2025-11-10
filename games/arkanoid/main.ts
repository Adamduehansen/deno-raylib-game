import { GameScene } from "./game-scene.ts";
import { GameOverScene } from "./game-over-scene.ts";
import { Game } from "@src/game.ts";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 450;

const gameScene = new GameScene();
const gameOverScene = new GameOverScene();

const game = new Game({
  title: "Arkanoid",
  height: GAME_HEIGHT,
  width: GAME_WIDTH,
  fps: 60,
  scenes: {
    "game": gameScene,
    "gameOver": gameOverScene,
  },
  initialScene: "game",
});

game.goToScene("game");

game.start();
