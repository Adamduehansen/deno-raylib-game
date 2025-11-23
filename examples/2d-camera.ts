import {
  beginDrawing,
  beginMode2D,
  Black,
  Blue,
  Camera,
  clearBackground,
  closeWindow,
  Color,
  DarkGray,
  drawLine,
  drawRectangle,
  drawRectangleLines,
  drawRectangleRec,
  drawText,
  endDrawing,
  endMode2D,
  fade,
  getMouseWheelMove,
  getRandomValue,
  Green,
  initWindow,
  isKeyDown,
  isKeyPressed,
  KeyA,
  KeyLeft,
  KeyR,
  KeyRight,
  KeyS,
  RayWhite,
  Rectangle,
  Red,
  setTargetFPS,
  SkyBlue,
  windowShouldClose,
} from "@src/raylib-bindings.ts";

if (import.meta.main) {
  const maxBuildings = 100;

  const screenWidth = 800;
  const screenHeight = 450;

  initWindow({
    width: screenWidth,
    height: screenHeight,
    title: "raylib [core] example - 2d camera",
  });

  const player: Rectangle = {
    x: 400,
    y: 280,
    width: 40,
    height: 40,
  };
  const buildings: Rectangle[] = [];
  const buildColors: Color[] = [];

  let spacing = 0;

  for (let i = 0; i < maxBuildings; i++) {
    const height = getRandomValue(100, 800);
    const width = getRandomValue(50, 200);
    const building: Rectangle = {
      height: height,
      width: width,
      x: -6000 + spacing,
      y: screenHeight - 130 - height,
    };
    buildings.push(building);

    spacing += width;

    buildColors.push([
      getRandomValue(200, 240),
      getRandomValue(200, 240),
      getRandomValue(200, 250),
      255,
    ]);
  }

  const camera: Camera = {
    target: {
      x: player.x + 20,
      y: player.y + 20,
    },
    offset: {
      x: screenWidth / 2,
      y: screenHeight / 2,
    },
    rotation: 0,
    zoom: 1,
  };

  setTargetFPS(60);

  while (windowShouldClose() === false) {
    // Update
    // ------------------------------------------------------------------------
    // Player movement
    if (isKeyDown(KeyRight)) {
      player.x += 2;
    } else if (isKeyDown(KeyLeft)) {
      player.x -= 2;
    }

    // Camera target follows the player
    camera.target = {
      x: player.x + 20,
      y: player.y + 20,
    };

    // Camera rotation control
    if (isKeyDown(KeyA)) {
      camera.rotation -= 1;
    } else if (isKeyDown(KeyS)) {
      camera.rotation += 1;
    }

    // Limit the rotation of the camera
    if (camera.rotation > 40) {
      camera.rotation = 40;
    } else if (camera.rotation < -40) {
      camera.rotation = -40;
    }

    // Camera zoom control
    camera.zoom = Math.exp(Math.log(camera.zoom) + getMouseWheelMove() * 0.1);
    if (camera.zoom > 3) {
      camera.zoom = 3;
    } else if (camera.zoom < 0.1) {
      camera.zoom = 0.1;
    }

    // Camera reset (rotation and zoom)
    if (isKeyPressed(KeyR)) {
      camera.zoom = 1;
      camera.rotation = 0;
    }
    // ------------------------------------------------------------------------

    // DRAWING
    // ------------------------------------------------------------------------

    beginDrawing();

    clearBackground(RayWhite);

    { // Draw player, buildings and camera
      beginMode2D(camera);

      drawRectangle({
        posX: -6000,
        posY: 320,
        width: 13000,
        height: 8000,
        color: DarkGray,
      });

      for (let i = 0; i < buildings.length; i++) {
        const building = buildings[i];
        drawRectangleRec(building, buildColors[i]);
      }

      drawRectangleRec(player, Red);

      drawLine({
        startPosX: camera.target.x,
        startPosY: -screenHeight * 10,
        endPosX: camera.target.x,
        endPosY: screenHeight * 10,
        color: Green,
      });

      drawLine({
        startPosX: -screenWidth * 10,
        startPosY: camera.target.y,
        endPosX: screenWidth * 10,
        endPosY: camera.target.y,
        color: Green,
      });

      endMode2D();
    }

    { // Draw screen area
      drawText({
        text: "SCREEN AREA",
        posX: 640,
        posY: 10,
        fontSize: 20,
        color: Red,
      });

      drawRectangle({
        posX: 0,
        posY: 0,
        width: screenWidth,
        height: 5,
        color: Red,
      });

      drawRectangle({
        posX: 0,
        posY: 0,
        width: 5,
        height: screenHeight,
        color: Red,
      });

      drawRectangle({
        posX: screenWidth - 5,
        posY: 0,
        width: 5,
        height: screenHeight,
        color: Red,
      });

      drawRectangle({
        posX: 0,
        posY: screenHeight - 5,
        width: screenWidth,
        height: 5,
        color: Red,
      });
    }

    { // Draw instructions
      drawRectangle({
        posX: 10,
        posY: 10,
        width: 250,
        height: 113,
        color: fade(SkyBlue, 0.5),
      });

      drawRectangleLines({
        posX: 10,
        posY: 10,
        width: 250,
        height: 113,
        color: Blue,
      });

      drawText({
        text: "Free 2d camera controls:",
        posX: 20,
        posY: 20,
        fontSize: 10,
        color: Black,
      });

      drawText({
        text: "- Right/Left to move Offset",
        posX: 40,
        posY: 40,
        fontSize: 10,
        color: DarkGray,
      });
    }

    endDrawing();
  }

  closeWindow();
}
