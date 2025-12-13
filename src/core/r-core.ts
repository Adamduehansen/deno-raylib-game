import { raylib } from "./raylib-bindings.ts";

// Types
// ----------------------------------------------------------------------------
export interface Camera {
  target: Vector;
  offset: Vector;
  rotation: number;
  zoom: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface RaylibTexture {
  id: number;
  width: number;
  height: number;
  mipmaps: number;
  format: number;
}

export interface RenderTexture {
  id: number;
  texture: RaylibTexture;
  depth: RaylibTexture;
}

export type Color = [number, number, number, number];

//-----------------------------------------------------------------------------
// Consts
// ----------------------------------------------------------------------------
export const Black: Color = [0, 0, 0, 255];
export const Blank: Color = [0, 0, 0, 0];
export const Blue: Color = [0, 121, 241, 255];
export const DarkBlue: Color = [0, 82, 172, 255];
export const DarkGray: Color = [80, 80, 80, 255];
export const DarkGreen: Color = [0, 117, 44, 255];
export const Gray: Color = [130, 130, 130, 255];
export const Green: Color = [0, 228, 48, 255];
export const LightGray: Color = [200, 200, 200, 255];
export const Maroon: Color = [190, 33, 55, 255];
export const Purple: Color = [200, 122, 255, 255];
export const RayWhite: Color = [245, 245, 245, 255];
export const Red: Color = [230, 41, 55, 255];
export const SkyBlue: Color = [102, 191, 255, 255];
export const White: Color = [255, 255, 255, 255];

//-----------------------------------------------------------------------------
// Converters
// ----------------------------------------------------------------------------

const cEncoder = new TextEncoder();
export function toCString(str: string): BufferSource {
  return cEncoder.encode(`${str}\0`);
}

export function toRaylibColor(arr: number[]): BufferSource {
  return new Uint8Array(arr);
}

/**
 * Converts a {@linkcode Vector} to a Raylib vector2 struct.
 */
export function toRaylibVector2(vector: Vector): BufferSource {
  return new Float32Array([vector.x, vector.y]);
}

/**
 * Converts a Raylib vector buffer to a {@linkcode Vector}.
 */
export function toVector(buffer: Uint8Array): Vector {
  const view = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );

  return {
    x: view.getFloat32(0, true),
    y: view.getFloat32(4, true),
  };
}

export function toRaylibRenderTexture(
  renderTexture: RenderTexture,
): BufferSource {
  // TODO: the size needs to be adjusted. 20 is just a guess.
  const SIZE = 8 + 20 + 20; // 42 bytes
  const buffer = new ArrayBuffer(SIZE);
  const view = new DataView(buffer);

  // id (i16)
  view.setInt16(0, renderTexture.id, true);

  // Texture
  const texOffset = 4;
  const t = renderTexture.texture;
  view.setUint32(texOffset + 0, t.id, true);
  view.setInt32(texOffset + 4, t.width, true);
  view.setInt32(texOffset + 8, t.height, true);
  view.setInt32(texOffset + 12, t.mipmaps, true);
  view.setInt32(texOffset + 16, t.format, true);

  // Depth
  const depthOffset = texOffset + 20;
  const d = renderTexture.depth;
  view.setUint32(depthOffset + 0, d.id, true);
  view.setInt32(depthOffset + 4, d.width, true);
  view.setInt32(depthOffset + 8, d.height, true);
  view.setInt32(depthOffset + 12, d.mipmaps, true);
  view.setInt32(depthOffset + 16, d.format, true);

  return new Uint8Array(buffer);
}

function toRaylibCamera2D(camera: Camera): BufferSource {
  return new Float32Array([
    camera.offset.x,
    camera.offset.y,
    camera.target.x,
    camera.target.y,
    camera.rotation,
    camera.zoom,
  ]);
}

//-----------------------------------------------------------------------------
// Window-related functions
// ----------------------------------------------------------------------------

/**
 * Close window and unload OpenGL context.
 */
export function closeWindow(): void {
  raylib.symbols.CloseWindow();
}

/**
 * Toggle window state: fullscreen/windowed, resizes monitor to match window
 * resolution.
 */
export function toggleFullScreen(): void {
  raylib.symbols.ToggleFullscreen();
}

/**
 * Get current monitor where window is placed.
 */
export function getCurrentMonitor(): number {
  return raylib.symbols.GetCurrentMonitor();
}

/**
 * Get specified monitor width (current video mode used by monitor).
 */
export function getMonitorWidth(monitor: number): number {
  return raylib.symbols.GetMonitorWidth(monitor);
}

/**
 * Get specified monitor height (current video mode used by monitor).
 */
export function getMonitorHeight(monitor: number): number {
  return raylib.symbols.GetMonitorHeight(monitor);
}

/**
 * Get current screen width.
 */
export function getScreenWidth(): number {
  return raylib.symbols.GetScreenWidth();
}

/**
 * Get current screen height.
 */
export function getScreenHeight(): number {
  return raylib.symbols.GetScreenHeight();
}

/**
 * Initialize window and OpenGL context.
 */
export function initWindow(options: {
  width: number;
  height: number;
  title: string;
}): void {
  raylib.symbols.InitWindow(
    options.width,
    options.height,
    toCString(options.title),
  );
}

/**
 * Check if window is currently fullscreen.
 */
export function isWindowFullScreen(): boolean {
  return raylib.symbols.IsWindowFullscreen();
}

/**
 * Set window dimensions.
 */
export function setWindowSize(width: number, height: number): void {
  raylib.symbols.SetWindowSize(width, height);
}

/**
 * Check if application should close (KEY_ESCAPE pressed or windows close icon
 * clicked).
 */
export function windowShouldClose(): boolean {
  return raylib.symbols.WindowShouldClose();
}

//-----------------------------------------------------------------------------
// Input-related functions: keyboard
// ----------------------------------------------------------------------------

// Key constants
export const KeySpace = 32;
export const KeyOne = 49;
export const KeyTwo = 50;
export const KeyA = 65;
export const KeyD = 68;
export const KeyP = 80;
export const KeyR = 82;
export const KeyS = 83;
export const KeyW = 87;
export const KeyEnter = 257;
export const KeyRight = 262;
export const KeyLeft = 263;
export const KeyDown = 264;
export const KeyUp = 265;
export const KeyLeftAlt = 342;
export const KeyRightAlt = 346;

/**
 * Check if a key is being pressed.
 */
export function isKeyDown(key: number): boolean {
  return raylib.symbols.IsKeyDown(key);
}

/**
 * Check if a key has been pressed once.
 */
export function isKeyPressed(key: number): boolean {
  return raylib.symbols.IsKeyPressed(key);
}

//-----------------------------------------------------------------------------
// Input-related functions: mouse
// ----------------------------------------------------------------------------

// Mouse constants
export const MouseButtonLeft = 0;

/**
 * Check if a mouse button is being pressed.
 */
export function isMouseButtonDown(key: number): boolean {
  return raylib.symbols.IsMouseButtonDown(key);
}

/**
 * Get mouse delta between frames.
 */
export function getMouseDelta(): Vector {
  return toVector(raylib.symbols.GetMouseDelta());
}

/**
 * Get mouse position XY.
 */
export function getMousePosition(): Vector {
  return toVector(raylib.symbols.GetMousePosition());
}

/**
 * Get mouse position X.
 */
export function getMouseX(): number {
  return raylib.symbols.GetMouseX();
}

/**
 * Get mouse position Y.
 */
export function getMouseY(): number {
  return raylib.symbols.GetMouseY();
}

/**
 * Get mouse wheel movement for X or Y, whichever is larger.
 */
export function getMouseWheelMove(): number {
  return raylib.symbols.GetMouseWheelMove();
}

//-----------------------------------------------------------------------------
// Drawing-related functions
// ----------------------------------------------------------------------------

/**
 * Setup canvas (framebuffer) to start drawing.
 */
export function beginDrawing(): void {
  raylib.symbols.BeginDrawing();
}

/** */
export function beginMode2D(camera: Camera): void {
  return raylib.symbols.BeginMode2D(toRaylibCamera2D(camera));
}

/**
 * Begin drawing to render texture.
 */
export function beginTextureMode(renderTexture: RenderTexture): void {
  raylib.symbols.BeginTextureMode(toRaylibRenderTexture(renderTexture));
}

/**
 * Set background color (framebuffer clear color).
 */
export function clearBackground(color: Color): void {
  raylib.symbols.ClearBackground(toRaylibColor(color));
}

/**
 * End canvas drawing and swap buffers (double buffering).
 */
export function endDrawing(): void {
  raylib.symbols.EndDrawing();
}

/**
 * Ends 2D mode with custom camera.
 */
export function endMode2D(): void {
  raylib.symbols.EndMode2D();
}

/**
 * Ends drawing to render texture.
 */
export function endTextureMode(): void {
  raylib.symbols.EndTextureMode();
}

// Screen-space-related functions
export function getScreenToWorld2D(
  position: Vector,
  camera: Camera,
): Vector {
  return toVector(raylib.symbols.GetScreenToWorld2D(
    toRaylibVector2(position),
    toRaylibCamera2D(camera),
  ));
}

//-----------------------------------------------------------------------------
// Timing-related functions
// ----------------------------------------------------------------------------

/**
 * Set target FPS (maximum)
 */
export function setTargetFPS(fps: number): void {
  raylib.symbols.SetTargetFPS(fps);
}

/**
 * Get current FPS.
 */
export function getFPS(): number {
  return raylib.symbols.GetFPS();
}

/**
 * Get time in seconds for last frame drawn (delta time).
 */
export function getFrameTime(): number {
  return raylib.symbols.GetFrameTime();
}

//-----------------------------------------------------------------------------
// Random values generation functions
//-----------------------------------------------------------------------------

/**
 * Get a random value between min and max (both included).
 */
export function getRandomValue(min: number, max: number): number {
  return raylib.symbols.GetRandomValue(min, max);
}

//-----------------------------------------------------------------------------
// Gestures and Touch Handling Functions (Module: rgestures)
//-----------------------------------------------------------------------------

// Gesture and touch contansts
export const GestureTap = 1;

/**
 * Check if a gesture have been detected.
 */
export function isGestureDetected(gesture: number): boolean {
  return raylib.symbols.IsGestureDetected(gesture);
}

//-----------------------------------------------------------------------------
// Color/pixel related functions
//-----------------------------------------------------------------------------

/**
 * Get color with alpha applied, alpha goes from 0.0f to 1.0f.
 */
export function fade(color: Color, alpha: number): Color {
  const result = raylib.symbols.Fade(toRaylibColor(color), alpha);
  return [result[0], result[1], result[2], result[3]];
}
