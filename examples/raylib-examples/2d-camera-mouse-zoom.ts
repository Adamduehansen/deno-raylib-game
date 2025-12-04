import {
  beginDrawing,
  beginMode2D,
  Black,
  Camera,
  clearBackground,
  closeWindow,
  DarkGray,
  DarkGreen,
  endDrawing,
  endMode2D,
  getMouseDelta,
  getMousePosition,
  getMouseWheelMove,
  getMouseX,
  getMouseY,
  getScreenHeight,
  getScreenToWorld2D,
  getScreenWidth,
  initWindow,
  isKeyPressed,
  isMouseButtonDown,
  KeyOne,
  KeyTwo,
  MouseButtonLeft,
  RayWhite,
  setTargetFPS,
  windowShouldClose,
} from "@src/r-core.ts";
import {
  clamp,
  rlPopMatrix,
  rlPushMatrix,
  rlRotatef,
  rlTranslatef,
  vector2Add,
  vector2Scale,
} from "@src/r-math.ts";
import { drawGrid } from "@src/r-models.ts";
import { drawCircle, drawCircleV } from "@src/r-shapes.ts";
import { drawTextEx, getFontDefault } from "@src/r-text.ts";

const screenWidth = 800;
const screenHeight = 450;

initWindow({
  title: "raylib [core] example - 2d camera mouse zoom",
  width: screenWidth,
  height: screenHeight,
});

const camera: Camera = {
  zoom: 1,
  rotation: 0,
  target: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
};

let zoomMode = 0;

setTargetFPS(60);

while (windowShouldClose() === false) {
  // Update
  // ------------------------------------------------------------------------
  if (isKeyPressed(KeyOne)) {
    zoomMode = 0;
  } else if (isKeyPressed(KeyTwo)) {
    zoomMode = 1;
  }

  // Translate based on mouse right click
  if (isMouseButtonDown(MouseButtonLeft)) {
    const mouseDelta = getMouseDelta();
    const delta = vector2Scale(mouseDelta, -1 / camera.zoom);
    camera.target = vector2Add(camera.target, delta);
  }

  if (zoomMode === 0) {
    // Zoom based on the mouse wheel.
    const wheelDelta = getMouseWheelMove();
    if (wheelDelta !== 0) {
      // Get the world point under the mouse
      const mouseWorldPos = getScreenToWorld2D(getMousePosition(), camera);

      // Set the offset to where the mouse is.
      camera.offset = getMousePosition();

      // Set the target to match, so that the camera maps the world space point
      // under the cursor to the screen space point under the cursor at any zoom
      camera.target = mouseWorldPos;

      // Zoom increment
      // Uses log scaling to provide consistent zoom speed
      const scale = 0.2 * wheelDelta;
      camera.zoom = clamp(Math.exp(Math.log(camera.zoom) + scale), 0.125, 64);
    }
  }

  // Drawing
  // ------------------------------------------------------------------------
  beginDrawing();

  clearBackground(RayWhite);

  beginMode2D(camera);
  rlPushMatrix();
  rlTranslatef(0, 25 * 50, 0);
  rlRotatef(90, 1, 0, 0);
  drawGrid(100, 50);
  rlPopMatrix();

  drawCircle({
    centerX: getScreenWidth() / 2,
    centerY: getScreenHeight() / 2,
    radius: 50,
    color: DarkGreen,
  });
  endMode2D();

  // Draw mouse reference
  drawCircleV({
    center: getMousePosition(),
    radius: 4,
    color: DarkGray,
  });

  drawTextEx({
    font: getFontDefault(),
    text: `[${getMouseX()}, ${getMouseY()}]`,
    tint: Black,
    spacing: 2,
    fontSize: 20,
    position: vector2Add(getMousePosition(), {
      x: -44,
      y: -24,
    }),
  });

  endDrawing();
}

closeWindow();
