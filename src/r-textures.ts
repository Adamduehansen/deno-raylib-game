import { raylib } from "./raylib-bindings.ts";
import {
  Color,
  RaylibTexture,
  RenderTexture,
  toCString,
  toRaylibColor,
  toRaylibRenderTexture,
  toRaylibVector2,
  Vector,
} from "./r-core.ts";
import { RaylibRectangle, toRaylibRectangle } from "./r-shapes.ts";

//-----------------------------------------------------------------------------
// Converters
// ----------------------------------------------------------------------------

function toTexture(textureBuffer: Uint8Array): RaylibTexture {
  const buffer = textureBuffer.buffer;
  const byteOffset = textureBuffer.byteOffset;
  const view = new DataView(buffer, byteOffset, textureBuffer.byteLength);

  return {
    id: view.getUint32(0, true),
    width: view.getInt32(4, true),
    height: view.getInt32(8, true),
    mipmaps: view.getInt32(12, true),
    format: view.getInt32(16, true),
  };
}

function toRaylibTexture(texture: RaylibTexture): BufferSource {
  return new Uint32Array([
    texture.id,
    texture.width,
    texture.height,
    texture.mipmaps,
    texture.format,
  ]);
}

function toRenderTexture(renderTexture: Uint8Array): RenderTexture {
  const buffer = renderTexture.buffer;
  const byteOffset = renderTexture.byteOffset;
  const view = new DataView(buffer, byteOffset, renderTexture.byteLength);

  // First field is i16
  const id = view.getInt16(0, true);

  // TextureStruct starts at offset 2 (u32 + i32 + i32 + i32 + i32) = 20 bytes
  const texOffset = 4;
  const texture: RaylibTexture = {
    id: view.getUint32(texOffset + 0, true),
    width: view.getInt32(texOffset + 4, true),
    height: view.getInt32(texOffset + 8, true),
    mipmaps: view.getInt32(texOffset + 12, true),
    format: view.getInt32(texOffset + 16, true),
  };

  // Depth texture follows the first TextureStruct (offset 2 + 20 = 22)
  const depthOffset = texOffset + 20;
  const depth: RaylibTexture = {
    id: view.getUint32(depthOffset + 0, true),
    width: view.getInt32(depthOffset + 4, true),
    height: view.getInt32(depthOffset + 8, true),
    mipmaps: view.getInt32(depthOffset + 12, true),
    format: view.getInt32(depthOffset + 16, true),
  };

  return {
    id: id,
    texture: texture,
    depth: depth,
  };
}

// Texture parameters
export const TEXTURE_FILTER_BILINEAR = 1;

export function loadRenderTexture(
  width: number,
  height: number,
): RenderTexture {
  const renderTexture = raylib.symbols.LoadRenderTexture(width, height);
  return toRenderTexture(renderTexture);
}

// ----------------------------------------------------------------------------
// Texture configuration functions
// ----------------------------------------------------------------------------

/**
 * Set texture scaling filter mode
 */
export function setTextureFilter(texture: RaylibTexture, filter: number): void {
  raylib.symbols.SetTextureFilter(toRaylibTexture(texture), filter);
}

/**
 * Draw a part of a texture defined by a rectangle with 'pro' parameters.
 */
export function drawTexturePro(args: {
  texture: RaylibTexture;
  source: RaylibRectangle;
  dest: RaylibRectangle;
  origin: Vector;
  rotation: number;
  tint: Color;
}): void {
  raylib.symbols.DrawTexturePro(
    toRaylibTexture(args.texture),
    toRaylibRectangle(args.source),
    toRaylibRectangle(args.dest),
    toRaylibVector2(args.origin),
    args.rotation,
    toRaylibColor(args.tint),
  );
}

// ----------------------------------------------------------------------------
// Texture loading functions.
// ----------------------------------------------------------------------------

/**
 * Load texture from file into GPU memory (VRAM)
 */
export function loadTexture(fileName: string): RaylibTexture {
  const texture = raylib.symbols.LoadTexture(toCString(fileName));
  return toTexture(texture);
}

/**
 * Unload texture from GPU memory (VRAM).
 */
export function unloadTexture(texture: RaylibTexture): void {
  return raylib.symbols.UnloadTexture(toRaylibTexture(texture));
}

/**
 * Unload render texture from GPU memory (VRAM).
 */
export function unloadRenderTexture(texture: RenderTexture): void {
  raylib.symbols.UnloadRenderTexture(toRaylibRenderTexture(texture));
}

// ----------------------------------------------------------------------------
// Texture drawing functions.
// ----------------------------------------------------------------------------

/**
 * Draw a Texture2D.
 */
export function drawTexture(args: {
  texture: RaylibTexture;
  x: number;
  y: number;
  color: Color;
}): void {
  return raylib.symbols.DrawTexture(
    toRaylibTexture(args.texture),
    args.x,
    args.y,
    toRaylibColor(args.color),
  );
}

/**
 * Draw a part of a texture defined by a rectangle
 */
export function drawTextureRec(args: {
  texture: RaylibTexture;
  rectangle: RaylibRectangle;
  vector: Vector;
  color: Color;
}): void {
  return raylib.symbols.DrawTextureRec(
    toRaylibTexture(args.texture),
    toRaylibRectangle(args.rectangle),
    toRaylibVector2(args.vector),
    toRaylibColor(args.color),
  );
}
