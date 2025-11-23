import {
  beginDrawing,
  clearBackground,
  closeWindow,
  drawText,
  endDrawing,
  initWindow,
  LightGray,
  setTargetFPS,
  White,
  windowShouldClose,
} from "@src/raylib-bindings.ts";

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  initWindow({
    width: 800,
    height: 450,
    title: "raylib [core] example - basic window",
  });
  setTargetFPS(60);

  while (windowShouldClose() === false) {
    beginDrawing();

    clearBackground(White);
    drawText({
      text: "Congrats! You created your first window!",
      posX: 190,
      posY: 200,
      fontSize: 20,
      color: LightGray,
    });

    endDrawing();
  }

  closeWindow();
}
