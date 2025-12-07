import Entity from "@src/entity.ts";
import { Resources } from "./resources.ts";
import { SpriteSheet } from "@src/graphics.ts";
import Game from "@src/game.ts";

const spriteSheet = SpriteSheet.fromImage(Resources.spriteSheet, {
  columns: 16,
  rows: 10,
  spriteHeight: 8,
  spriteWidth: 8,
  spacing: {
    x: 1,
    y: 1,
  },
});

const PLAYER_SPEED = 2;

export default class Player extends Entity {
  constructor() {
    super();

    this.addGraphic("player", spriteSheet.getSprite(4, 0));
    this.useGraphic("player");
  }

  override update(game: Game): void {
    super.update(game);

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
