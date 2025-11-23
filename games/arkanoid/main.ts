import { GameScene } from "./game-scene.ts";
import { GameOverScene } from "./game-over-scene.ts";
import { Game } from "./engine/game.ts";
import { GAME_HEIGHT, GAME_WIDTH } from "./consts.ts";

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
