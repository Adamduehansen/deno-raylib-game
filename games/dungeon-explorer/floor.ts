import Entity from "@src/entity.ts";
import { SpriteSheet } from "@src/graphics.ts";
import { Resources } from "./resources.ts";

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

export default class Floor extends Entity {
  constructor() {
    super();

    this.addGraphic("floor", spriteSheet.getSprite(1, 1));
    this.useGraphic("floor");
  }
}
