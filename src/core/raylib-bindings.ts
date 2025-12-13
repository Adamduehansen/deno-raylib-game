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

const SoundStruct = {
  struct: [
    AudioStreamStruct, // stream
    "u32", // frameCount
  ],
} as const;

const MusicStruct = {
  struct: [
    AudioStreamStruct, // Stream
    "u32", // frameCount
    "bool", // looping
    "i32", // ctxType   // <-- should be i32, not i16
    "buffer", // ctxData (*void)
  ],
} as const;

const FontStruct = {
  struct: [
    "u32", // baseSize
    "i32", // glyphCount
    "i32", // glyphPadding
    TextureStruct, // texture
    "buffer", // recs (Rectangle array pointer)
    "buffer", // glyphs (GlyphInfo array pointer)
  ],
} as const;

const RenderTexture2DStruct = {
  struct: [
    "i16",
    TextureStruct,
    TextureStruct,
  ],
} as const;

export const raylib = Deno.dlopen("./lib/libraylib.so.5.5.0", {
  BeginDrawing: {
    parameters: [],
    result: "void",
  },
  BeginMode2D: {
    parameters: [Camera2DStruct],
    result: "void",
  },
  BeginTextureMode: {
    parameters: [RenderTexture2DStruct],
    result: "void",
  },
  CheckCollisionRecs: {
    parameters: [RectangleStruct, RectangleStruct],
    result: "bool",
  },
  CheckCollisionCircleRec: {
    parameters: [Vector2Struct, "f32", RectangleStruct],
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
  CloseAudioDevice: {
    parameters: [],
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
  DrawCircleLinesV: {
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
  DrawRectangleLinesEx: {
    parameters: [RectangleStruct, "f32", ColorStruct],
    result: "void",
  },
  DrawRectangleRec: {
    parameters: [RectangleStruct, ColorStruct],
    result: "void",
  },
  DrawRectangleV: {
    parameters: [Vector2Struct, Vector2Struct, ColorStruct],
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
  DrawTexturePro: {
    parameters: [
      TextureStruct,
      RectangleStruct,
      RectangleStruct,
      Vector2Struct,
      "f32",
      ColorStruct,
    ],
    result: "void",
  },
  DrawTextureRec: {
    parameters: [TextureStruct, RectangleStruct, Vector2Struct, ColorStruct],
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
  EndTextureMode: {
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
  LoadMusicStream: {
    parameters: ["buffer"],
    result: MusicStruct,
  },
  LoadRenderTexture: {
    parameters: ["i16", "i16"],
    result: RenderTexture2DStruct,
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
  PlayMusicStream: {
    parameters: [MusicStruct],
    result: "void",
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
  SetTextureFilter: {
    parameters: [TextureStruct, "i16"],
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
  UnloadSound: {
    parameters: [SoundStruct],
    result: "void",
  },
  UnloadMusicStream: {
    parameters: [MusicStruct],
    result: "void",
  },
  UnloadRenderTexture: {
    parameters: [TextureStruct],
    result: "void",
  },
  UpdateMusicStream: {
    parameters: [MusicStruct],
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
