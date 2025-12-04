import { Color, toRaylibColor, toRaylibVector2, Vector } from "./r-core.ts";
import { raylib } from "./raylib-bindings.ts";

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function toRaylibRectangle(rec: Rectangle): BufferSource {
  return new Float32Array([rec.x, rec.y, rec.width, rec.height]);
}

// ----------------------------------------------------------------------------
// Basic shapes drawing functions
// ----------------------------------------------------------------------------

/**
 * Draw a color-filled circle
 */
export function drawCircle(args: {
  centerX: number;
  centerY: number;
  radius: number;
  color: Color;
}): void {
  raylib.symbols.DrawCircle(
    args.centerX,
    args.centerY,
    args.radius,
    toRaylibColor(args.color),
  );
}

/**
 * Draw circle outline (Vector version)
 */
export function drawCircleLinesV(args: {
  center: Vector;
  radius: number;
  color: Color;
}): void {
  raylib.symbols.DrawCircleLinesV(
    toRaylibVector2(args.center),
    args.radius,
    toRaylibColor(args.color),
  );
}

/**
 * Draw a color-filled circle (Vector version)
 */
export function drawCircleV(args: {
  center: Vector;
  radius: number;
  color: Color;
}): void {
  raylib.symbols.DrawCircleV(
    toRaylibVector2(args.center),
    args.radius,
    toRaylibColor(args.color),
  );
}

/**
 * Draw a line.
 */
export function drawLine(args: {
  startPosX: number;
  startPosY: number;
  endPosX: number;
  endPosY: number;
  color: Color;
}): void {
  raylib.symbols.DrawLine(
    args.startPosX,
    args.startPosY,
    args.endPosX,
    args.endPosY,
    toRaylibColor(args.color),
  );
}

/**
 * Draw a color-filled rectangle.
 */
export function drawRectangle(args: {
  posX: number;
  posY: number;
  width: number;
  height: number;
  color: Color;
}): void {
  raylib.symbols.DrawRectangle(
    args.posX,
    args.posY,
    args.width,
    args.height,
    toRaylibColor(args.color),
  );
}

/**
 * Draw rectangle outline.
 */
export function drawRectangleLines(args: {
  posX: number;
  posY: number;
  width: number;
  height: number;
  color: Color;
}): void {
  raylib.symbols.DrawRectangleLines(
    args.posX,
    args.posY,
    args.width,
    args.height,
    toRaylibColor(args.color),
  );
}

/**
 * Draw a color-filled rectangle.
 */
export function drawRectangleRec(rectangle: Rectangle, color: Color): void {
  raylib.symbols.DrawRectangleRec(
    toRaylibRectangle(rectangle),
    toRaylibColor(color),
  );
}

/**
 * Draw a color-filled rectangle (Vector version).
 */
export function drawRectangleV(
  position: Vector,
  size: Vector,
  color: Color,
): void {
  raylib.symbols.DrawRectangleV(
    toRaylibVector2(position),
    toRaylibVector2(size),
    toRaylibColor(color),
  );
}

/**
 * Draw rectangle outline with extended parameters.
 */
export function drawRectangleLinesEx(args: {
  rec: Rectangle;
  lineThick: number;
  color: Color;
}): void {
  return raylib.symbols.DrawRectangleLinesEx(
    toRaylibRectangle(args.rec),
    args.lineThick,
    toRaylibColor(args.color),
  );
}

// ----------------------------------------------------------------------------
// Basic shapes collision detection functions.
// ----------------------------------------------------------------------------

/**
 * Check collision between two rectangles.
 */
export function checkCollisionRecs(rec1: Rectangle, rec2: Rectangle): boolean {
  return raylib.symbols.CheckCollisionRecs(
    toRaylibRectangle(rec1),
    toRaylibRectangle(rec2),
  );
}

/**
 * Check collision between circle and rectangle.
 */
export function checkCollisionCircleRec(
  vector: Vector,
  radius: number,
  rectangle: Rectangle,
): boolean {
  return raylib.symbols.CheckCollisionCircleRec(
    toRaylibVector2(vector),
    radius,
    toRaylibRectangle(rectangle),
  );
}
