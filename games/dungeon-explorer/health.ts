import ScreenElement from "@src/screen-element.ts";
import spriteSheet from "./spriteSheet.ts";

export default class Health extends ScreenElement {
  constructor() {
    super();

    this.addGraphic("heart-full", spriteSheet.getSprite(6, 6));
    this.addGraphic("heart-empty", spriteSheet.getSprite(4, 6));
    this.useGraphic("heart-full");
  }
}
