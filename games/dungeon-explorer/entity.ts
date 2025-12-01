import {
  Green,
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
import { drawRectangleLinesEx } from "@src/r-shapes.ts";

interface EntityArgs {
  position: Vector;
  spriteIndex: Vector;
  name: string;
  collide: boolean;
}

class Body {
  private readonly _owner: Entity;
  private _position: Vector;

  constructor(entity: Entity) {
    this._owner = entity;
    this._position = this._owner.position;
  }

  update(): void {
    this._position.x = this._owner.position.x;
    this._position.y = this._owner.position.y;
  }

  render(): void {
    drawRectangleLinesEx({
      color: Green,
      lineThick: 1,
      rec: {
        x: this._position.x,
        y: this._position.y,
        height: 8,
        width: 8,
      },
    });
  }
}

export default abstract class Entity {
  private _textureResource: TextureResource;
  private _spriteIndex: Vector;

  position: Vector;

  readonly name: string;
  readonly body?: Body;

  constructor(args: EntityArgs) {
    this._textureResource = ResourceManager.getInstance().get<TextureResource>(
      "spritesheet",
    );
    this.position = args.position;
    this._spriteIndex = args.spriteIndex;
    this.name = args.name;

    if (args.collide) {
      this.body = new Body(this);
    }
  }

  update(): void {
    this.body?.update();
  }

  render(): void {
    const textureSpacing = 1;

    drawTextureRec({
      texture: this._textureResource.texture,
      rectangle: {
        x: 8 * this._spriteIndex.x + textureSpacing * this._spriteIndex.x,
        y: 8 * this._spriteIndex.y + textureSpacing * this._spriteIndex.y,
        height: 8,
        width: 8,
      },
      color: White,
      vector: {
        x: this.position.x,
        y: this.position.y,
      },
    });

    this.body?.render();
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
      collide: true,
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
      collide: true,
    });
  }
}

export class Wall extends Entity {
  constructor(args: Args) {
    super({
      position: args.position,
      spriteIndex: vec(1, 0),
      name: "wall",
      collide: true,
    });
  }
}

export class Floor extends Entity {
  constructor(args: Args) {
    super({
      position: args.position,
      spriteIndex: vec(1, 1),
      name: "floor",
      collide: false,
    });
  }
}
