import {
  isKeyDown,
  KeyA,
  KeyD,
  KeyS,
  KeyW,
  Vector,
  White,
} from "@src/r-core.ts";
import ResourceManager, { TextureResource } from "./resource-manager.ts";
import { drawTextureRec } from "@src/r-textures.ts";
import { vec } from "@src/math.ts";

interface EntityArgs {
  position: Vector;
  spriteIndex: Vector;
  name: string;
}

export default abstract class Entity {
  private _textureResource: TextureResource;
  private _spriteIndex: Vector;

  position: Vector;

  readonly name: string;

  constructor(args: EntityArgs) {
    this._textureResource = ResourceManager.getInstance().get(
      "spritesheet",
      // TODO: Fix this casting!
    ) as unknown as TextureResource;
    this.position = args.position;
    this._spriteIndex = args.spriteIndex;
    this.name = args.name;
  }

  update(): void {}

  render(): void {
    const textureMargin = 1;

    drawTextureRec({
      texture: this._textureResource.texture,
      rectangle: {
        x: 8 * this._spriteIndex.x + textureMargin * this._spriteIndex.x,
        y: 8 * this._spriteIndex.y + textureMargin * this._spriteIndex.y,
        height: 8,
        width: 8,
      },
      color: White,
      vector: {
        x: this.position.x,
        y: this.position.y,
      },
    });
  }
}

interface Args {
  position: Vector;
}

const PLAYER_SPEED = 2;

export class Player extends Entity {
  constructor(args: Args) {
    super({
      position: args.position,
      spriteIndex: vec(4, 0),
      name: "player",
    });
  }

  override update(): void {
    super.update();

    if (isKeyDown(KeyD)) {
      this.position.x += PLAYER_SPEED;
    } else if (isKeyDown(KeyA)) {
      this.position.x -= PLAYER_SPEED;
    }

    if (isKeyDown(KeyW)) {
      this.position.y -= PLAYER_SPEED;
    } else if (isKeyDown(KeyS)) {
      this.position.y += PLAYER_SPEED;
    }
  }
}

export class Beholder extends Entity {
  constructor(args: Args) {
    super({
      position: args.position,
      spriteIndex: vec(13, 0),
      name: "beholder",
    });
  }
}

export class Wall extends Entity {
  constructor(args: Args) {
    super({
      position: args.position,
      spriteIndex: vec(1, 0),
      name: "wall",
    });
  }
}

export class Floor extends Entity {
  constructor(args: Args) {
    super({
      position: args.position,
      spriteIndex: vec(1, 1),
      name: "floor",
    });
  }
}
