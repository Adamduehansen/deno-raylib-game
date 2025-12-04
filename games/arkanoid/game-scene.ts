import { Scene } from "./engine/scene.ts";
import { Text } from "./engine/entity.ts";
import { Ball } from "./ball.ts";
import { Paddle } from "./paddle.ts";
import { Brick } from "./brick.ts";
import { Life } from "./life.ts";
import { Game } from "./engine/game.ts";
import { vec } from "@src/r-math.ts";
import {
  DarkGray,
  getScreenHeight,
  Gray,
  isKeyPressed,
  KeyP,
  KeySpace,
} from "@src/r-core.ts";

const MAX_LIFES = 1;

export class GameScene extends Scene {
  #paused = false;
  #pauseText = new Text("GAME PAUSED", {
    color: Gray,
    fontSize: 48,
    pos: vec(0, 0),
  });

  override initialize(game: Game): void {
    this.entityManager.add(this.#pauseText);
    this.#pauseText.pos = vec(game.width / 2, game.height / 2);
    this.#pauseText.renderer.setAlpha(0);

    this.eventEmitter.on("decreaseLife", () => {
      const lifes = this.entityManager.query((entity) =>
        entity.name === "life"
      );

      if (lifes.length > 1) {
        this.entityManager.remove(lifes.at(-1));
      } else {
        this.entityManager.clear();
        game.goToScene("gameOver");
      }
    });

    this.eventEmitter.on("brick-destroyed", () => {
      const numberOfBricksLeft = this.entityManager.query((entity) =>
        entity.name === "brick"
      ).length;

      if (numberOfBricksLeft === 0) {
        this.entityManager.clear();
        game.goToScene("gameOver");
      }
    });

    this.eventEmitter.on("pause", (pause) => {
      if (typeof pause !== "boolean") {
        return;
      }

      if (pause === true) {
        this.#pauseText.renderer.setAlpha(255);
      } else {
        this.#pauseText.renderer.setAlpha(0);
      }
    });
  }

  override activate(): void {
    super.activate();

    const paddle = new Paddle();
    this.entityManager.add(paddle);
    this.entityManager.add(new Ball(paddle));

    let colorIndex = 0;
    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 20; columnIndex++) {
        this.entityManager.add(
          new Brick({
            pos: vec(40 * columnIndex + Brick.size / 2, 40 * rowIndex + 40),
            color: rowIndex % 2 === 0
              ? columnIndex % 2 === 0 ? Gray : DarkGray
              : columnIndex % 2 === 0
              ? DarkGray
              : Gray,
          }),
        );
        colorIndex += 1;
      }
    }

    for (let index = 0; index < MAX_LIFES; index++) {
      this.entityManager.add(
        new Life({
          pos: {
            x: index * 50 + 45,
            y: getScreenHeight() - 20,
          },
        }),
      );
    }
  }

  override update(game: Game): void {
    super.update(game);

    if (isKeyPressed(KeySpace)) {
      this.eventEmitter.emit("activate");
    } else if (isKeyPressed(KeyP)) {
      this.#paused = !this.#paused;
      this.eventEmitter.emit("pause", this.#paused);
    }
  }
}
