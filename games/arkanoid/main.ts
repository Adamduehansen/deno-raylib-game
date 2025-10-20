import { Entity } from "@src/entity.ts";
import { Scene } from "@src/scene.ts";
import {
  beginDrawing,
  Black,
  clearBackground,
  closeWindow,
  drawCircleV,
  drawRectangle,
  endDrawing,
  initWindow,
  isKeyDown,
  isKeyPressed,
  KeyA,
  KeyD,
  KeySpace,
  Maroon,
  RayWhite,
  setTargetFPS,
  windowShouldClose,
} from "../../raylib-bindings.ts";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 450;

class Ball extends Entity {
  #paddle: Paddle;

  constructor(paddle: Paddle) {
    super({
      pos: {
        x: 0,
        y: 0,
      },
    });
    this.#paddle = paddle;
  }

  override initialize(): void {
    this.scene?.eventEmitter.on("active", (activated) => {
      console.log("active", activated);
    });
  }

  override render(): void {
    drawCircleV({
      center: {
        x: this.pos.x,
        y: this.pos.y,
      },
      color: Maroon,
      radius: 7,
    });
  }

  override update(): void {
    this.pos.x = this.#paddle.pos.x + Paddle.width / 2;
    this.pos.y = this.#paddle.pos.y - 20;
  }
}

class Paddle extends Entity {
  static width = 80;

  constructor() {
    super({
      pos: {
        x: GAME_WIDTH / 2 - Paddle.width / 2,
        y: Math.floor(GAME_HEIGHT * 7 / 8),
      },
    });
  }

  override update(): void {
    if (isKeyDown(KeyD)) {
      this.pos.x += 5;
    }
    if (this.pos.x < 0) {
      this.pos.x = 0;
    }

    if (isKeyDown(KeyA)) {
      this.pos.x -= 5;
    }
    if (this.pos.x + Paddle.width > GAME_WIDTH) {
      this.pos.x = GAME_WIDTH - Paddle.width;
    }
  }

  override render(): void {
    drawRectangle({
      color: Black,
      height: 20,
      width: 80,
      posX: this.pos.x,
      posY: this.pos.y,
    });
  }
}

class GameScene extends Scene {
  constructor() {
    super();

    const paddle = new Paddle();
    this.add(paddle);
    this.add(new Ball(paddle));
  }

  override update(): void {
    super.update();

    if (isKeyPressed(KeySpace)) {
      this.eventEmitter.emit("active", true);
    }
  }
}

class GameOverScene extends Scene {
}

const gameScene = new GameScene();
const gameOverScene = new GameOverScene();
const scenes = {
  gameScene,
  gameOverScene,
};
const currentScene: keyof typeof scenes = "gameScene";

initWindow({
  title: "Arkanoid",
  height: GAME_HEIGHT,
  width: GAME_WIDTH,
});

setTargetFPS(60);

while (windowShouldClose() === false) {
  // Update
  // ==========================================================================
  scenes[currentScene].update();

  // Render
  // ==========================================================================
  beginDrawing();
  clearBackground(RayWhite);
  scenes[currentScene].render();
  endDrawing();
}

closeWindow();
