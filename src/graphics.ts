import { Rectangle, vec } from "./math.ts";
import { White } from "./r-core.ts";
import { drawTextureRec } from "./r-textures.ts";
import { Image } from "./resource.ts";

interface SpriteArgs {
  image: Image;
  sourceView: Rectangle;
}

interface Graphic {
  render(): void;
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
