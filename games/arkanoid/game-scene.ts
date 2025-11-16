import { Scene, SceneContext } from "@src/scene.ts";
import {
  DarkGray,
  getScreenHeight,
  Gray,
  isKeyPressed,
  KeyP,
  KeySpace,
} from "../../raylib-bindings.ts";
import { Ball } from "./ball.ts";
import { Paddle } from "./paddle.ts";
import { Brick } from "./brick.ts";
import { vec } from "@src/math.ts";
import { Life } from "./life.ts";
import { Text } from "@src/entity.ts";

const MAX_LIFES = 3;

export class GameScene extends Scene {
  #paused = false;
  #pauseText = new Text("GAME PAUSED", {
    color: Gray,
    fontSize: 48,
    pos: vec(0, 0),
  });

  override initialize({ game }: SceneContext): void {
    this.entityManager.add(this.#pauseText);
    this.#pauseText.pos = vec(game.width / 2, game.height / 2);

    this.eventEmitter.on("decreaseLife", () => {
      const lifes = this.entityManager.query((entity) =>
        entity.name === "life"
      );

      if (lifes.length > 1) {
        lifes.at(-1)?.remove();
      } else {
        this.entityManager.clear();
        this.game?.goToScene("gameOver");
      }
    });

    this.eventEmitter.on("brick-destroyed", () => {
      const numberOfBricksLeft = this.entityManager.query((entity) =>
        entity.name === "brick"
      ).length;

      if (numberOfBricksLeft === 0) {
        this.entityManager.clear();
        this.game?.goToScene("gameOver");
      }
    });

    this.eventEmitter.on("pause", (pause) => {
      if (typeof pause !== "boolean") {
        return;
      }

      // if (pause === true) {
      //   this.#pauseText.
      // } else {
      //   this.#pauseText.hide();
      // }
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

  override update(): void {
    super.update();

    if (isKeyPressed(KeySpace)) {
      this.eventEmitter.emit("activate");
    } else if (isKeyPressed(KeyP)) {
      this.#paused = !this.#paused;
      this.eventEmitter.emit("pause", this.#paused);
    }
  }
}
