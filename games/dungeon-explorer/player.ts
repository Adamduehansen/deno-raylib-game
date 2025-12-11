import Entity from "@src/entity.ts";
import Game from "@src/game.ts";
import spriteSheet from "./spriteSheet.ts";
import Scene from "@src/scene.ts";
import { RectangleBody } from "@src/body.ts";

const PLAYER_SPEED = 1;

export default class Player extends Entity {
  constructor() {
    super();

    this.addGraphic("player", spriteSheet.getSprite(4, 0));
    this.useGraphic("player");

    this.body = new RectangleBody(8, 8);
  }

  override onCollisionStart(_scene: Scene): void {
    console.log("Collision starts");
  }

  override onCollisionEnd(_scene: Scene): void {
    console.log("Collision end");
  }

  override update(scene: Scene, game: Game): void {
    super.update(scene, game);

    if (game.input.keyboard.isKeyDown("S")) {
      this.velocity.y = PLAYER_SPEED;
    } else if (game.input.keyboard.isKeyDown("W")) {
      this.velocity.y = -PLAYER_SPEED;
    } else {
      this.velocity.y = 0;
    }

    if (game.input.keyboard.isKeyDown("A")) {
      this.velocity.x = -PLAYER_SPEED;
    } else if (game.input.keyboard.isKeyDown("D")) {
      this.velocity.x = PLAYER_SPEED;
    } else {
      this.velocity.x = 0;
    }
  }
}
