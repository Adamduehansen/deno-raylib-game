import {
  Color,
  drawCircleV,
  drawRectangleRec,
  drawTextEx,
  getFontDefault,
  measureText,
} from "@src/raylib-bindings.ts";
import { Entity, Text } from "./entity.ts";

export abstract class Renderer<TEntity extends Entity> {
  color: Color;

  constructor(color: Color) {
    this.color = color;
  }

  setAlpha(value: number): void {
    const [r, g, b] = this.color;
    this.color = [r, g, b, value];
  }

  abstract render(entity: TEntity): void;
}

export class TextRenderer extends Renderer<Text> {
  override render(entity: Text): void {
    const textLength = measureText(entity.text, entity.fontSize);
    drawTextEx({
      text: entity.text,
      tint: this.color,
      fontSize: entity.fontSize,
      spacing: 3,
      font: getFontDefault(),
      position: {
        x: entity.pos.x - textLength / 2,
        y: entity.pos.y,
      },
    });
  }
}

export class RectangleRenderer extends Renderer<Entity> {
  override render(entity: Entity): void {
    drawRectangleRec({
      height: entity.height,
      width: entity.width,
      x: entity.pos.x - entity.width / 2,
      y: entity.pos.y - entity.height / 2,
    }, this.color);
  }
}

export class CircleRenderer extends Renderer<Entity> {
  override render(entity: Entity): void {
    drawCircleV({
      center: {
        x: entity.pos.x,
        y: entity.pos.y,
      },
      color: this.color,
      radius: entity.width,
    });
  }
}
