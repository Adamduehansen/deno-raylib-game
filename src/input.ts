import { isKeyDown, isKeyPressed, KeyA, KeyD, KeyS, KeyW } from "./r-core.ts";

const Keys = {
  A: KeyA,
  D: KeyD,
  S: KeyS,
  W: KeyW,
} as const;

type Key = keyof typeof Keys;

class Keybaord {
  isKeyPressed(key: Key): boolean {
    return isKeyPressed(Keys[key]);
  }

  isKeyDown(key: Key): boolean {
    return isKeyDown(Keys[key]);
  }
}

export default class Input {
  readonly keyboard = new Keybaord();
}
