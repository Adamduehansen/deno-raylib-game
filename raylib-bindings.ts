const ColorStruct = {
  struct: [
    "u8", // r
    "u8", // g
    "u8", // b
    "u8", // a
  ],
} as const;

const RectangleStruct = {
  struct: [
    "f32", // x
    "f32", // y
    "f32", // width
    "f32", // height
  ],
} as const;

const Camera2DStruct = {
  struct: [
    "f32", // offset.x
    "f32", // offset.y
    "f32", // target.x
    "f32", // target.y
    "f32", // rotation
    "f32", // zoom
  ],
} as const;

const Vector2Struct = {
  struct: [
    "f32", // x
    "f32", // y
  ],
} as const;

const TextureStruct = {
  struct: [
    "u32", // id
    "i32", // width
    "i32", // height
    "i32", // mipmaps
    "i32", // format
  ],
} as const;

const AudioStreamStruct = {
  struct: [
    "u32", // sampleRate
    "u32", // sampleSize
    "u32", // channels
    "u32", // bufferCount
    "u32", // frameCount
    "buffer", // data (void*)
  ],
} as const;

export const SoundStruct = {
  struct: [
    AudioStreamStruct, // stream
    "u32", // frameCount
  ],
} as const;

const GlyphInfoStruct = {
  struct: [
    "i32", // value
    "i32", // offsetX
    "i32", // offsetY
    "i32", // advanceX
    RectangleStruct, // imageRec
    "buffer", // image (Image struct pointer or handle)
  ],
} as const;

export const FontStruct = {
  struct: [
    "u32", // baseSize
    "i32", // glyphCount
    "i32", // glyphPadding
    TextureStruct, // texture
    "buffer", // recs (Rectangle array pointer)
    "buffer", // glyphs (GlyphInfo array pointer)
  ],
} as const;

const raylib = Deno.dlopen("./lib/libraylib.so.5.5.0", {
  BeginDrawing: {
    parameters: [],
    result: "void",
  },
  BeginMode2D: {
    parameters: [Camera2DStruct],
    result: "void",
  },
  CheckCollisionRecs: {
    parameters: [RectangleStruct, RectangleStruct],
    result: "bool",
  },
  Clamp: {
    parameters: ["f32", "f32", "f32"],
    result: "f32",
  },
  ClearBackground: {
    parameters: [ColorStruct],
    result: "void",
  },
  CloseWindow: {
    parameters: [],
    result: "void",
  },
  DrawCircle: {
    parameters: ["i16", "i16", "f32", ColorStruct],
    result: "void",
  },
  DrawCircleV: {
    parameters: [Vector2Struct, "f32", ColorStruct],
    result: "void",
  },
  DrawFPS: {
    parameters: ["i16", "i16"],
    result: "void",
  },
  DrawGrid: {
    parameters: ["i32", "f32"],
    result: "void",
  },
  DrawLine: {
    parameters: ["i16", "i16", "i16", "i16", ColorStruct],
    result: "void",
  },
  DrawRectangle: {
    parameters: ["i16", "i16", "i16", "i16", ColorStruct],
    result: "void",
  },
  DrawRectangleLines: {
    parameters: ["i16", "i16", "i16", "i16", ColorStruct],
    result: "void",
  },
  DrawRectangleRec: {
    parameters: [RectangleStruct, ColorStruct],
    result: "void",
  },
  DrawText: {
    parameters: ["buffer", "i16", "i16", "i16", ColorStruct],
    result: "void",
  },
  DrawTextEx: {
    parameters: [
      FontStruct,
      "buffer",
      Vector2Struct,
      "f32",
      "f32",
      ColorStruct,
    ],
    result: "void",
  },
  DrawTexture: {
    parameters: [TextureStruct, "i16", "i16", ColorStruct],
    result: "void",
  },
  EndDrawing: {
    parameters: [],
    result: "void",
  },
  EndMode2D: {
    parameters: [],
    result: "void",
  },
  Fade: {
    parameters: [ColorStruct, "f32"],
    result: ColorStruct,
  },
  GetFontDefault: {
    parameters: [],
    result: FontStruct,
  },
  GetFPS: {
    parameters: [],
    result: "i32",
  },
  GetFrameTime: {
    parameters: [],
    result: "f32",
  },
  GetCurrentMonitor: {
    parameters: [],
    result: "i32",
  },
  GetMonitorWidth: {
    parameters: ["i32"],
    result: "i32",
  },
  GetMonitorHeight: {
    parameters: ["i32"],
    result: "i32",
  },
  GetMouseDelta: {
    parameters: [],
    result: Vector2Struct,
  },
  GetMousePosition: {
    parameters: [],
    result: Vector2Struct,
  },
  GetMouseWheelMove: {
    parameters: [],
    result: "f32",
  },
  GetMouseX: {
    parameters: [],
    result: "i32",
  },
  GetMouseY: {
    parameters: [],
    result: "i32",
  },
  GetRandomValue: {
    parameters: ["i32", "i32"],
    result: "i32",
  },
  GetScreenHeight: {
    parameters: [],
    result: "i16",
  },
  GetScreenToWorld2D: {
    parameters: [Vector2Struct, Camera2DStruct],
    result: Vector2Struct,
  },
  GetScreenWidth: {
    parameters: [],
    result: "i16",
  },
  InitAudioDevice: {
    parameters: [],
    result: "void",
  },
  InitWindow: {
    parameters: ["i16", "i16", "buffer"],
    result: "void",
  },
  IsWindowFullscreen: {
    parameters: [],
    result: "bool",
  },
  IsGestureDetected: {
    parameters: ["i16"],
    result: "bool",
  },
  IsKeyPressed: {
    parameters: ["i16"],
    result: "bool",
  },
  IsKeyDown: {
    parameters: ["i16"],
    result: "bool",
  },
  IsMouseButtonDown: {
    parameters: ["i16"],
    result: "bool",
  },
  LoadTexture: {
    parameters: ["buffer"],
    result: TextureStruct,
  },
  LoadSound: {
    parameters: ["buffer"],
    result: SoundStruct,
  },
  MeasureText: {
    parameters: ["buffer", "i32"],
    result: "i32",
  },
  PlaySound: {
    parameters: [SoundStruct],
    result: "void",
  },
  rlPushMatrix: {
    parameters: [],
    result: "void",
  },
  rlPopMatrix: {
    parameters: [],
    result: "void",
  },
  rlRotatef: {
    parameters: ["f32", "f32", "f32", "f32"],
    result: "void",
  },
  rlTranslatef: {
    parameters: ["f32", "f32", "f32"],
    result: "void",
  },
  SetTargetFPS: {
    parameters: ["i16"],
    result: "void",
  },
  SetWindowSize: {
    parameters: ["i32", "i32"],
    result: "void",
  },
  ToggleFullscreen: {
    parameters: [],
    result: "void",
  },
  UnloadTexture: {
    parameters: [TextureStruct],
    result: "void",
  },
  Vector2Scale: {
    parameters: [Vector2Struct, "f32"],
    result: Vector2Struct,
  },
  Vector2Add: {
    parameters: [Vector2Struct, Vector2Struct],
    result: Vector2Struct,
  },
  WindowShouldClose: {
    parameters: [],
    result: "bool",
  },
});

const cEncoder = new TextEncoder();
function toCString(str: string): BufferSource {
  return cEncoder.encode(`${str}\0`);
}

function toUint8Array(arr: number[]): BufferSource {
  return new Uint8Array(arr);
}

function toRaylibColor(arr: number[]): BufferSource {
  return toUint8Array(arr);
}

function toRaylibSound(sound: Sound): BufferSource {
  // AudioStreamStruct: [sampleRate, sampleSize, channels, bufferCount, frameCount, data]
  // SoundStruct: [AudioStreamStruct..., frameCount]
  const buffer = new ArrayBuffer(32); // 6 * 4 bytes + 8 bytes (pointer) + 4 bytes (frameCount)
  const view = new DataView(buffer);

  // AudioStream fields
  view.setUint32(0, sound.stream.sampleRate, true);
  view.setUint32(4, sound.stream.sampleSize, true);
  view.setUint32(8, sound.stream.channels, true);
  view.setUint32(12, sound.stream.bufferCount, true);
  view.setUint32(16, sound.stream.frameCount, true);
  view.setBigUint64(20, BigInt(sound.stream.data), true); // pointer

  // Sound.frameCount
  view.setUint32(28, sound.frameCount, true);

  return new Uint8Array(buffer);
}

function toCamera2DArray(camera: Camera): BufferSource {
  return new Float32Array([
    camera.offset.x,
    camera.offset.y,
    camera.target.x,
    camera.target.y,
    camera.rotation,
    camera.zoom,
  ]);
}

function toRaylibRectangle(rec: Rectangle): BufferSource {
  return new Float32Array([rec.x, rec.y, rec.width, rec.height]);
}

function toFloat32Array(arr: number[]): BufferSource {
  return new Float32Array(arr);
}

export function toTexture(textureBuffer: Uint8Array): Texture {
  // TextureStruct: [id (u32), width (i32), height (i32), mipmaps (i32), format (i32)]
  // Use DataView for correct type handling
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

function toRaylibTexture(texture: Texture): BufferSource {
  return new Uint32Array([
    texture.id,
    texture.width,
    texture.height,
    texture.mipmaps,
    texture.format,
  ]);
}

export function toSound(soundBuffer: Uint8Array): Sound {
  // SoundStruct layout:
  // [AudioStreamStruct (6 fields), frameCount (u32)]
  // AudioStreamStruct: [sampleRate, sampleSize, channels, bufferCount, frameCount, data]
  const buffer = soundBuffer.buffer;
  const byteOffset = soundBuffer.byteOffset;
  const view = new DataView(buffer, byteOffset, soundBuffer.byteLength);

  // AudioStream fields (all u32 except data, which is a pointer)
  const sampleRate = view.getUint32(0, true);
  const sampleSize = view.getUint32(4, true);
  const channels = view.getUint32(8, true);
  const bufferCount = view.getUint32(12, true);
  const streamFrameCount = view.getUint32(16, true);
  const data = view.getBigUint64(20, true); // pointer (use getBigUint64 for 64-bit pointer)

  // Sound.frameCount (u32)
  const frameCount = view.getUint32(28, true);

  return {
    stream: {
      sampleRate,
      sampleSize,
      channels,
      bufferCount,
      frameCount: streamFrameCount,
      data: Number(data), // cast pointer to number
    },
    frameCount,
  };
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Vector2 {
  x: number;
  y: number;
}

export interface Camera {
  target: Vector2;
  offset: Vector2;
  rotation: number;
  zoom: number;
}

interface Font {
  baseSize: number;
  glyphCount: number;
  glyphPadding: number;
  texture: number; // pointer or handle
  recs: number; // pointer
  glyphs: number; // pointer
}

export interface Texture {
  id: number;
  width: number;
  height: number;
  mipmaps: number;
  format: number;
}

export interface AudioStream {
  sampleRate: number;
  sampleSize: number;
  channels: number;
  bufferCount: number;
  frameCount: number;
  data: number; // pointer
}

export interface Sound {
  stream: AudioStream;
  frameCount: number;
}

// Color constants
export type Color = [number, number, number, number];
export const Black: Color = [0, 0, 0, 255];
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

// Key constants
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
export const KeyLeftAlt = 342;
export const KeyRightAlt = 346;

// Mouse constants
export const MouseButtonLeft = 0;

// Gesture and touch contansts
export const GestureTap = 1;

// Window related functions
// ----------------------------------------------------------------------------
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

export function closeWindow(): void {
  raylib.symbols.CloseWindow();
}

export function windowShouldClose(): boolean {
  return raylib.symbols.WindowShouldClose();
}

export function getCurrentMonitor(): number {
  return raylib.symbols.GetCurrentMonitor();
}
export function isWindowFullScreen(): boolean {
  return raylib.symbols.IsWindowFullscreen();
}

export function setWindowSize(width: number, height: number): void {
  raylib.symbols.SetWindowSize(width, height);
}

export function getMonitorWidth(monitor: number): number {
  return raylib.symbols.GetMonitorWidth(monitor);
}

export function getMonitorHeight(monitor: number): number {
  return raylib.symbols.GetMonitorHeight(monitor);
}

export function toggleFullScreen(): void {
  raylib.symbols.ToggleFullscreen();
}

export function getScreenWidth(): number {
  return raylib.symbols.GetScreenWidth();
}

export function getScreenHeight(): number {
  return raylib.symbols.GetScreenHeight();
}

// ???
// ----------------------------------------------------------------------------

export function beginDrawing(): void {
  raylib.symbols.BeginDrawing();
}

export function endDrawing(): void {
  raylib.symbols.EndDrawing();
}

// Basic shapes collision detection functions
// ----------------------------------------------------------------------------
export function checkCollisionRecs(rec1: Rectangle, rec2: Rectangle): boolean {
  return raylib.symbols.CheckCollisionRecs(
    toRaylibRectangle(rec1),
    toRaylibRectangle(rec2),
  );
}

// Basic shapes drawing functions
// ----------------------------------------------------------------------------

export function clearBackground(color: Color): void {
  raylib.symbols.ClearBackground(toUint8Array(color));
}

export function drawCircle(args: {
  centerX: number;
  centerY: number;
  radius: number;
  color: Color;
}): void {
  return raylib.symbols.DrawCircle(
    args.centerX,
    args.centerY,
    args.radius,
    toUint8Array(args.color),
  );
}

export function drawCircleV(args: {
  center: Vector2;
  radius: number;
  color: Color;
}): void {
  raylib.symbols.DrawCircleV(
    toFloat32Array([args.center.x, args.center.y]),
    args.radius,
    toUint8Array(args.color),
  );
}

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
    toUint8Array(args.color),
  );
}

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
    toUint8Array(args.color),
  );
}

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
    toUint8Array(args.color),
  );
}

export function drawRectangleRec(rectangle: Rectangle, color: Color): void {
  raylib.symbols.DrawRectangleRec(
    toFloat32Array([
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height,
    ]),
    toUint8Array(color),
  );
}

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
    toUint8Array(args.color),
  );
}

export function beginMode2D(camera: Camera) {
  return raylib.symbols.BeginMode2D(toCamera2DArray(camera));
}

export function endMode2D(): void {
  raylib.symbols.EndMode2D();
}

// Timing-related functions
// ----------------------------------------------------------------------------
export function setTargetFPS(fps: number): void {
  raylib.symbols.SetTargetFPS(fps);
}

export function getFPS(): number {
  return raylib.symbols.GetFPS();
}

export function getFrameTime(): number {
  return raylib.symbols.GetFrameTime();
}

// Input related functions: keyboard
// ----------------------------------------------------------------------------
export function isKeyPressed(key: number): boolean {
  return raylib.symbols.IsKeyPressed(key);
}

export function isKeyDown(key: number): boolean {
  return raylib.symbols.IsKeyDown(key);
}

// Input-related functions: mouse
// ----------------------------------------------------------------------------
export function getMousePosition(): Vector2 {
  const mousePosition = raylib.symbols.GetMousePosition();
  const view = new DataView(
    mousePosition.buffer,
    mousePosition.byteOffset,
    mousePosition.byteLength,
  );

  return {
    x: view.getFloat32(0, true),
    y: view.getFloat32(4, true),
  };
}

export function getMouseWheelMove(): number {
  return raylib.symbols.GetMouseWheelMove();
}

export function getMouseX(): number {
  return raylib.symbols.GetMouseX();
}

export function getMouseY(): number {
  return raylib.symbols.GetMouseY();
}

export function isMouseButtonDown(key: number) {
  return raylib.symbols.IsMouseButtonDown(key);
}

export function getMouseDelta(): Vector2 {
  const result = raylib.symbols.GetMouseDelta();
  const view = new DataView(
    result.buffer,
    result.byteOffset,
    result.byteLength,
  );

  return {
    x: view.getFloat32(0, true),
    y: view.getFloat32(4, true),
  };
}

// Texture loading functions
// ----------------------------------------------------------------------------
export function loadTexture(fileName: string): Texture {
  const texture = raylib.symbols.LoadTexture(toCString(fileName));
  return toTexture(texture);
}

export function unloadTexture(texture: Texture): void {
  return raylib.symbols.UnloadTexture(toRaylibTexture(texture));
}

// Gesture and touch handling functions
// ----------------------------------------------------------------------------
export function isGestureDetected(gesture: number): boolean {
  return raylib.symbols.IsGestureDetected(gesture);
}

// Random values generation functions
// ----------------------------------------------------------------------------
export function getRandomValue(min: number, max: number): number {
  return raylib.symbols.GetRandomValue(min, max);
}

// Color/pixel related functions
// ----------------------------------------------------------------------------
export function fade(color: Color, alpha: number): Color {
  const result = raylib.symbols.Fade(toUint8Array(color), alpha);
  return [result[0], result[1], result[2], result[3]];
}

// Screen and space related functions
// ----------------------------------------------------------------------------
export function getScreenToWorld2D(position: Vector2, camera: Camera): Vector2 {
  const result = raylib.symbols.GetScreenToWorld2D(
    toFloat32Array([position.x, position.y]),
    toCamera2DArray(camera),
  );
  const view = new DataView(
    result.buffer,
    result.byteOffset,
    result.byteLength,
  );

  return {
    x: view.getFloat32(0, true),
    y: view.getFloat32(4, true),
  };
}

// Basic geometric 3D shapes drawing functions
// ----------------------------------------------------------------------------
export function drawGrid(slices: number, spacing: number): void {
  raylib.symbols.DrawGrid(slices, spacing);
}

// Math Utilities
// ----------------------------------------------------------------------------
export function vector2Scale(vector2: Vector2, scale: number): Vector2 {
  const result = raylib.symbols.Vector2Scale(
    toFloat32Array([vector2.x, vector2.y]),
    scale,
  );
  const view = new DataView(
    result.buffer,
    result.byteOffset,
    result.byteLength,
  );

  return {
    x: view.getFloat32(0, true),
    y: view.getFloat32(4, true),
  };
}

export function vector2Add(vector2A: Vector2, vector2B: Vector2): Vector2 {
  const result = raylib.symbols.Vector2Add(
    toFloat32Array([vector2A.x, vector2A.y]),
    toFloat32Array([vector2B.x, vector2B.y]),
  );

  const view = new DataView(
    result.buffer,
    result.byteOffset,
    result.byteLength,
  );

  return {
    x: view.getFloat32(0, true),
    y: view.getFloat32(4, true),
  };
}

export function clamp(value: number, min: number, max: number): number {
  return raylib.symbols.Clamp(value, min, max);
}

// Text drawing functions
// ----------------------------------------------------------------------------

export function drawTextEx(args: {
  font: Font;
  text: string;
  position: Vector2;
  fontSize: number;
  spacing: number;
  tint: Color;
}): void {
  raylib.symbols.DrawTextEx(
    toFontStruct(args.font),
    toCString(args.text),
    toFloat32Array([args.position.x, args.position.y]),
    args.fontSize,
    args.spacing,
    toUint8Array(args.tint),
  );
}

export function drawFPS(x: number, y: number): void {
  return raylib.symbols.DrawFPS(x, y);
}

// Texture drawing functions
// ----------------------------------------------------------------------------
export function drawTexture(args: {
  texture: Texture;
  x: number;
  y: number;
  color: Color;
}): void {
  return raylib.symbols.DrawTexture(
    toRaylibTexture(args.texture),
    args.x,
    args.y,
    toRaylibColor(White),
  );
}

// Font loading/unloading functions
// ----------------------------------------------------------------------------

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

// Text font info functions
// ----------------------------------------------------------------------------
export function measureText(str: string, fontSize: number): number {
  return raylib.symbols.MeasureText(toCString(str), fontSize);
}

// RLGH
export function rlPushMatrix(): void {
  raylib.symbols.rlPushMatrix();
}

export function rlPopMatrix(): void {
  raylib.symbols.rlPopMatrix();
}

export function rlTranslatef(x: number, y: number, z: number): void {
  raylib.symbols.rlTranslatef(x, y, z);
}

export function rlRotatef(
  angle: number,
  x: number,
  y: number,
  z: number,
): void {
  raylib.symbols.rlRotatef(angle, x, y, z);
}

// Audio device management functions
export function initAudioDevice(): void {
  return raylib.symbols.InitAudioDevice();
}

// Wave/Sound loading/unloading functions
export function loadSound(fileName: string): Sound {
  return toSound(raylib.symbols.LoadSound(toCString(fileName)));
}

// Wave/Sound management functions
export function playSound(sound: Sound): void {
  return raylib.symbols.PlaySound(toRaylibSound(sound));
}
