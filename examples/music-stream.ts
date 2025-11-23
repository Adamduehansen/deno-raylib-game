import {
  beginDrawing,
  clearBackground,
  closeAudioDevice,
  closeWindow,
  endDrawing,
  initAudioDevice,
  initWindow,
  loadMusicStream,
  playMusicStream,
  RayWhite,
  setTargetFPS,
  unloadMusicStream,
  updateMusicStream,
  windowShouldClose,
} from "@src/raylib-bindings.ts";

initWindow({
  title: "raylib [audio] example - music stream",
  width: 800,
  height: 450,
});

initAudioDevice();

const music = loadMusicStream("examples/resources/country.mp3");
// console.log("ctxData:", music.ctxType);

playMusicStream(music);

setTargetFPS(30);

while (windowShouldClose() === false) {
  updateMusicStream(music);

  beginDrawing();
  clearBackground(RayWhite);
  endDrawing();
}

unloadMusicStream(music);

closeAudioDevice();

closeWindow();
