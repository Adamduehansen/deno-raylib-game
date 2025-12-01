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
import { Rectangle, vec } from "@src/math.ts";
import { checkCollisionRecs, drawRectangleLinesEx } from "@src/r-shapes.ts";
import Level from "./level.ts";
import { DEBUG } from "./settings.ts";

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

  getBounds(): Rectangle {
    return {
      x: this._position.x,
      y: this._position.y,
      width: 8,
      height: 8,
    };
  }
}

interface EntityArgs {
  position: Vector;
  spriteIndex: Vector;
  name: string;
  collide: boolean;
  level: Level;
}

export default abstract class Entity {
  private _textureResource: TextureResource;
  private _spriteIndex: Vector;
  readonly level: Level;

  position: Vector;
  velocity: Vector;

  flipHorizontal: boolean = false;

  readonly name: string;
  readonly body?: Body;

  constructor(args: EntityArgs) {
    this._textureResource = ResourceManager.getInstance().get<TextureResource>(
      "spritesheet",
    );
    this._spriteIndex = args.spriteIndex;
    this.level = args.level;

    this.position = args.position;
    this.name = args.name;
    this.velocity = vec(0, 0);

    if (args.collide) {
      this.body = new Body(this);
    }
  }

  update(): void {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.body?.update();
  }

  render(): void {
    const textureSpacing = 1;

    drawTextureRec({
      texture: this._textureResource.texture,
      rectangle: {
        x: 8 * this._spriteIndex.x + textureSpacing * this._spriteIndex.x,
        y: 8 * this._spriteIndex.y + textureSpacing * this._spriteIndex.y,
        width: this.flipHorizontal ? -8 : 8,
        height: 8,
      },
      color: White,
      vector: {
        x: this.position.x,
        y: this.position.y,
      },
    });

    if (DEBUG) {
      this.body?.render();
    }
  }
}

interface Args {
  position: Vector;
  level: Level;
}

const PLAYER_SPEED = 2;

export class Player extends Entity {
  constructor(args: Args) {
    super({
      position: args.position,
      level: args.level,
      spriteIndex: vec(4, 0),
      name: "player",
      collide: true,
    });
  }

  override update(): void {
    super.update();

    for (const levelLayoutEntity of this.level.levelLayout) {
      if (levelLayoutEntity.body === undefined) {
        continue;
      }

      if (
        checkCollisionRecs(
          this.body!.getBounds(),
          levelLayoutEntity.body?.getBounds(),
        )
      ) {
        this.velocity.x *= -1;
        this.velocity.y *= -1;
        return;
      }
    }

    if (isKeyDown(KeyD)) {
      this.velocity.x = PLAYER_SPEED;
    } else if (isKeyDown(KeyA)) {
      this.velocity.x = -PLAYER_SPEED;
    } else {
      this.velocity.x = 0;
    }

    if (isKeyDown(KeyW)) {
      this.velocity.y = -PLAYER_SPEED;
    } else if (isKeyDown(KeyS)) {
      this.velocity.y = PLAYER_SPEED;
    } else {
      this.velocity.y = 0;
    }
  }
}

export class Beholder extends Entity {
  constructor(args: Args) {
    super({
      position: args.position,
      level: args.level,
      spriteIndex: vec(13, 0),
      name: "beholder",
      collide: true,
    });
  }

  override update(): void {
    super.update();

    if (this.position.x < this.level.player.position.x) {
      this.velocity.x = 0.2;
    } else if (this.position.x > this.level.player.position.x) {
      this.velocity.x = -0.2;
    } else {
      this.velocity.x = 0;
    }

    if (this.position.y < this.level.player.position.y) {
      this.velocity.y = 0.2;
    } else if (this.position.y > this.level.player.position.y) {
      this.velocity.y = -0.2;
    } else {
      this.velocity.y = 0;
    }

    if (this.level.player.position.x + 1 > this.position.x) {
      this.flipHorizontal = true;
    } else {
      this.flipHorizontal = false;
    }
  }
}

export class Wall extends Entity {
  constructor(args: Args) {
    super({
      position: args.position,
      level: args.level,
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
      level: args.level,
      spriteIndex: vec(1, 1),
      name: "floor",
      collide: false,
    });
  }
}
