import { Red, Vector, White } from "./r-core.ts";
import { drawTextureRec } from "./r-textures.ts";
import { drawRectangleRec, RaylibRectangle } from "./r-shapes.ts";
import { Image } from "./resource.ts";
import { vec } from "./math.ts";

export default interface Graphic {
  render(pos: Vector): void;
}

interface SpriteArgs {
  image: Image;
  sourceView: RaylibRectangle;
}

export class Sprite implements Graphic {
  readonly image: Image;
  readonly sourceView: RaylibRectangle;

  constructor(args: SpriteArgs) {
    this.image = args.image;
    this.sourceView = args.sourceView;
  }

  render(pos: Vector): void {
    if (this.image.resource === undefined) {
      return;
    }

    drawTextureRec({
      color: White,
      texture: this.image.resource,
      vector: vec(
        pos.x - this.sourceView.width / 2,
        pos.y - this.sourceView.height / 2,
      ),
      rectangle: this.sourceView,
    });
  }
}

export class Rectangle implements Graphic {
  constructor(readonly width: number, readonly height: number) {}

  render(pos: Vector): void {
    drawRectangleRec({
      x: pos.x - this.width / 2,
      y: pos.y - this.height / 2,
      width: this.width,
      height: this.height,
    }, Red);
  }
}

interface SpriteSheetArgs {
  sprites: Sprite[];
  rows: number;
  columns: number;
  spriteWidth: number;
  spriteHeight: number;
}

interface GridArgs {
  rows: number;
  columns: number;
  spriteWidth: number;
  spriteHeight: number;
  spacing: Vector;
}

export class SpriteSheet {
  readonly sprites: Sprite[];
  readonly rows: number;
  readonly columns: number;
  readonly spriteWidth: number;
  readonly spriteHeight: number;

  constructor(args: SpriteSheetArgs) {
    this.sprites = args.sprites;
    this.rows = args.rows;
    this.columns = args.columns;
    this.spriteWidth = args.spriteWidth;
    this.spriteHeight = args.spriteHeight;
  }

  getSprite(x: number, y: number): Sprite {
    return this.sprites[this.columns * y + x];
  }

  static fromImage(image: Image, grid: GridArgs): SpriteSheet {
    const sprites: Sprite[] = [];

    for (let row = 0; row < grid.rows; row++) {
      for (let column = 0; column < grid.columns; column++) {
        sprites.push(
          new Sprite({
            image: image,
            sourceView: {
              x: grid.spriteWidth * column + grid.spacing.x * column,
              y: grid.spriteHeight * row + grid.spacing.y * row,
              height: grid.spriteHeight,
              width: grid.spriteWidth,
            },
          }),
        );
      }
    }

    return new SpriteSheet({
      sprites: sprites,
      columns: grid.columns,
      rows: grid.rows,
      spriteWidth: grid.spriteWidth,
      spriteHeight: grid.spriteHeight,
    });
  }
}
