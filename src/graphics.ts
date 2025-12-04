import { Rectangle, vec } from "./math.ts";
import { Vector, White } from "./r-core.ts";
import { drawTextureRec } from "./r-textures.ts";
import { Image } from "./resource.ts";

interface Graphic {
  render(): void;
}

interface SpriteArgs {
  image: Image;
  sourceView: Rectangle;
}

export class Sprite implements Graphic {
  private _image: Image;
  private _sourceView: Rectangle;

  constructor(args: SpriteArgs) {
    this._image = args.image;
    this._sourceView = args.sourceView;
  }

  render(): void {
    if (this._image.resource === undefined) {
      return;
    }

    drawTextureRec({
      color: White,
      texture: this._image.resource,
      vector: vec(0, 0),
      rectangle: this._sourceView,
    });
  }
}

interface SpriteSheetArgs {
  sprites: Sprite[];
  rows?: number;
  columns?: number;
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

  constructor(args: SpriteSheetArgs) {
    this.sprites = args.sprites;
    this.rows = args.rows ?? 1;
    this.columns = args.columns ?? this.sprites.length;
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
    });
  }
}

export class Graphics {
  private _currentGraphic?: Graphic;

  render(): void {
    if (this._currentGraphic === undefined) {
      return;
    }

    this._currentGraphic.render();
  }

  use(graphic: Graphic): void {
    this._currentGraphic = graphic;
  }
}
