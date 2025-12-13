import {
  type Color,
  toCString,
  toRaylibColor,
  toRaylibVector2,
  type Vector,
} from "./r-core.ts";
import { raylib } from "./raylib-bindings.ts";

// ----------------------------------------------------------------------------
// Types.
// ----------------------------------------------------------------------------

export interface Font {
  baseSize: number;
  glyphCount: number;
  glyphPadding: number;
  texture: number; // pointer or handle
  recs: number; // pointer
  glyphs: number; // pointer
}

export function toRaylibFont(font: Font): BufferSource {
  return new Uint32Array([
    font.baseSize,
    font.glyphCount,
    font.glyphPadding,
    font.texture,
    font.recs,
    font.glyphs,
  ]);
}

// ----------------------------------------------------------------------------
// Converter.
// ----------------------------------------------------------------------------

function toFontStruct(font: Font) {
  return new Uint32Array([
    font.baseSize,
    font.glyphCount,
    font.glyphPadding,
    font.texture,
    font.recs,
    font.glyphs,
  ]);
}

// ----------------------------------------------------------------------------
// Font loading/unloading functions.
// ----------------------------------------------------------------------------

/**
 * Get the default Font.
 */
export function getFontDefault(): Font {
  const font = raylib.symbols.GetFontDefault();

  return {
    baseSize: font[0],
    glyphCount: font[1],
    glyphPadding: font[2],
    texture: font[3],
    recs: font[4],
    glyphs: font[5],
  };
}

// ----------------------------------------------------------------------------
// Text drawing functions.
// ----------------------------------------------------------------------------

/**
 * Draw current FPS.
 */
export function drawFPS(x: number, y: number): void {
  return raylib.symbols.DrawFPS(x, y);
}

/**
 * Draw text (using default font).
 */
export function drawText(args: {
  text: string;
  posX: number;
  posY: number;
  fontSize: number;
  color: Color;
}): void {
  raylib.symbols.DrawText(
    toCString(args.text),
    args.posX,
    args.posY,
    args.fontSize,
    toRaylibColor(args.color),
  );
}

/**
 * Draw text using font and additional parameters.
 */
export function drawTextEx(args: {
  font: Font;
  text: string;
  position: Vector;
  fontSize: number;
  spacing: number;
  tint: Color;
}): void {
  raylib.symbols.DrawTextEx(
    toFontStruct(args.font),
    toCString(args.text),
    toRaylibVector2(args.position),
    args.fontSize,
    args.spacing,
    toRaylibColor(args.tint),
  );
}

// ----------------------------------------------------------------------------
// Text font info functions.
// ----------------------------------------------------------------------------

/**
 * Measure string width for default font.
 */
export function measureText(str: string, fontSize: number): number {
  return raylib.symbols.MeasureText(toCString(str), fontSize);
}
