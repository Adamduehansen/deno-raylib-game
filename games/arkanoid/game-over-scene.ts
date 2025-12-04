import { Scene } from "./engine/scene.ts";
import { Text } from "./engine/entity.ts";
import { vec } from "@src/r-math.ts";
import { Game } from "./engine/game.ts";
import { Gray, isKeyPressed, KeyEnter } from "@src/r-core.ts";

export class GameOverScene extends Scene {
  #gameOverText = new Text("PRESS [ENTER] TO PLAY AGAIN", {
    color: Gray,
    fontSize: 30,
    pos: vec(0, 0),
  });

  override initialize(game: Game): void {
    this.entityManager.add(this.#gameOverText);
    this.#gameOverText.pos = vec(game.width / 2, game.height / 2);
  }

  override update(game: Game): void {
    super.update(game);

    if (isKeyPressed(KeyEnter)) {
      game.goToScene("game");
    }
  }
}
