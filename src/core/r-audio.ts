import { toCString } from "./r-core.ts";
import { raylib } from "./raylib-bindings.ts";

interface AudioStream {
  sampleRate: number;
  sampleSize: number;
  channels: number;
  bufferCount: number;
  frameCount: number;
  data: number;
}

export interface RaylibSound {
  stream: AudioStream;
  frameCount: number;
}

// ----------------------------------------------------------------------------
// Converters
// ----------------------------------------------------------------------------

function toSound(soundBuffer: Uint8Array): RaylibSound {
  const buffer = soundBuffer.buffer;
  const byteOffset = soundBuffer.byteOffset;
  const view = new DataView(buffer, byteOffset, soundBuffer.byteLength);

  // AudioStream fields
  const sampleRate = view.getUint32(0, true);
  const sampleSize = view.getUint32(4, true);
  const channels = view.getUint32(8, true);
  const bufferCount = view.getUint32(12, true);
  const streamFrameCount = view.getUint32(16, true);
  const data = view.getBigUint64(20, true);

  // Sound.frameCount
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

function toRaylibSound(sound: RaylibSound): BufferSource {
  const buffer = new ArrayBuffer(32);
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

// ----------------------------------------------------------------------------
// Audio device management functions
// ----------------------------------------------------------------------------

/**
 * Close the audio device and context.
 */
export function closeAudioDevice(): void {
  return raylib.symbols.CloseAudioDevice();
}

/**
 * Initialize audio device and context.
 */
export function initAudioDevice(): void {
  return raylib.symbols.InitAudioDevice();
}

// ----------------------------------------------------------------------------
// Music management functions
// ----------------------------------------------------------------------------

/**
 * Load music stream from file.
 */
export function loadMusicStream(fileName: string): BufferSource {
  return raylib.symbols.LoadMusicStream(toCString(fileName));
}

/**
 * Start music playing.
 */
export function playMusicStream(music: BufferSource): void {
  return raylib.symbols.PlayMusicStream(music);
}

/**
 * Updates buffers for music streaming.
 */
export function updateMusicStream(music: BufferSource): void {
  return raylib.symbols.UpdateMusicStream(music);
}

/**
 * Unload music stream.
 */
export function unloadMusicStream(music: BufferSource): void {
  return raylib.symbols.UnloadMusicStream(music);
}

// ----------------------------------------------------------------------------
// Wave/Sound loading/unloading functions
// ----------------------------------------------------------------------------

export function loadSound(fileName: string): RaylibSound {
  return toSound(raylib.symbols.LoadSound(toCString(fileName)));
}

export function unloadSound(sound: RaylibSound): void {
  return raylib.symbols.UnloadSound(toRaylibSound(sound));
}

export function playSound(sound: RaylibSound): void {
  return raylib.symbols.PlaySound(toRaylibSound(sound));
}
