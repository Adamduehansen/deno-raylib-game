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

export default spriteSheet;
