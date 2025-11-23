import {
  beginDrawing,
  Blue,
  clearBackground,
  closeWindow,
  DarkBlue,
  DarkGreen,
  drawRectangle,
  drawText,
  endDrawing,
  GestureTap,
  Gray,
  Green,
  initWindow,
  isGestureDetected,
  isKeyPressed,
  KeyEnter,
  LightGray,
  Maroon,
  Purple,
  RayWhite,
  setTargetFPS,
  windowShouldClose,
} from "@src/raylib-bindings.ts";

type Screen = "Logo" | "Title" | "GamePlay" | "Ending";

if (import.meta.main) {
  const screenWidth = 800;
  const screenHeight = 450;

  initWindow({
    width: screenWidth,
    height: screenHeight,
    title: "raylib [core] example - basic screen manager",
  });

  let currentScreen: Screen = "Logo";

  let framesCounter = 0;

  setTargetFPS(60);

  while (windowShouldClose() === false) {
    switch (currentScreen) {
      case "Logo": {
        framesCounter += 1;

        if (framesCounter > 120) {
          currentScreen = "Title";
        }
        break;
      }
      case "Title": {
        if (isKeyPressed(KeyEnter) || isGestureDetected(GestureTap)) {
          currentScreen = "GamePlay";
        }
        break;
      }
      case "GamePlay": {
        if (isKeyPressed(KeyEnter) || isGestureDetected(GestureTap)) {
          currentScreen = "Ending";
        }

        break;
      }
      case "Ending": {
        if (isKeyPressed(KeyEnter) || isGestureDetected(GestureTap)) {
          currentScreen = "Title";
        }
        break;
      }
      default:
        break;
    }

    // Drawing
    beginDrawing();

    clearBackground(RayWhite);

    switch (currentScreen) {
      case "Logo": {
        drawText({
          text: "Logo Screen",
          posX: 20,
          posY: 20,
          fontSize: 40,
          color: LightGray,
        });
        drawText({
          text: "Wait for 2 seconds...",
          posX: 290,
          posY: 220,
          fontSize: 20,
          color: Gray,
        });
        break;
      }
      case "Title": {
        drawRectangle({
          posX: 0,
          posY: 0,
          width: screenWidth,
          height: screenHeight,
          color: Green,
        });
        drawText({
          text: "Title screen",
          posX: 20,
          posY: 20,
          fontSize: 40,
          color: DarkGreen,
        });
        drawText({
          text: "PRESS ENTER or TAP to JUMP to GAMEPLAY SCREEN",
          posX: 120,
          posY: 220,
          fontSize: 20,
          color: DarkGreen,
        });
        break;
      }
      case "GamePlay": {
        drawRectangle({
          posX: 0,
          posY: 0,
          width: screenWidth,
          height: screenHeight,
          color: Blue,
        });
        drawText({
          text: "Gameplay screen",
          posX: 20,
          posY: 20,
          fontSize: 40,
          color: Maroon,
        });
        drawText({
          text: "PRESS ENTER or TAP to JUMP to ENDING SCREEN",
          posX: 120,
          posY: 220,
          fontSize: 20,
          color: Maroon,
        });
        break;
      }
      case "Ending": {
        drawRectangle({
          posX: 0,
          posY: 0,
          width: screenWidth,
          height: screenHeight,
          color: Purple,
        });
        drawText({
          text: "Ending screen",
          posX: 20,
          posY: 20,
          fontSize: 40,
          color: DarkBlue,
        });
        drawText({
          text: "PRESS ENTER or TAP to JUMP to TITLE SCREEN",
          posX: 120,
          posY: 220,
          fontSize: 20,
          color: DarkBlue,
        });
        break;
      }
      default:
        break;
    }

    endDrawing();
  }

  closeWindow();
}
