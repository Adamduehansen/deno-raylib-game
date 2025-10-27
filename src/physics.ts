interface BodyArgs {
  width: number;
  height: number;
}

export class RectangleBody {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
