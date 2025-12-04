import { Image, ResourceManager, Sound } from "@src/resource.ts";
import {
  beginDrawing,
  clearBackground,
  closeWindow,
  endDrawing,
  initWindow,
  setTargetFPS,
  White,
  windowShouldClose,
} from "@src/r-core.ts";
import { closeAudioDevice, initAudioDevice } from "@src/r-audio.ts";
import { Graphics, SpriteSheet } from "@src/graphics.ts";

initWindow({
  title: "Examples - managing resources",
  height: 450,
  width: 800,
});

setTargetFPS(60);

initAudioDevice();

const resourceFolderPath = import.meta.dirname + "/resources";

const Resources = {
  spritesheetImage: new Image(resourceFolderPath + "/spritesheet.png"),
  sound: new Sound(resourceFolderPath + "/boom.wav"),
} as const;

const resourceManager = new ResourceManager(Object.values(Resources));

resourceManager.load();

const spriteSheet = SpriteSheet.fromImage(Resources.spritesheetImage, {
  columns: 16,
  rows: 10,
  spriteHeight: 8,
  spriteWidth: 8,
  spacing: {
    x: 1,
    y: 1,
  },
});

const graphics = new Graphics();
graphics.use(spriteSheet.getSprite(4, 1));

while (windowShouldClose() === false) {
  beginDrawing();

  clearBackground(White);

  graphics.render();

  endDrawing();
}

resourceManager.unload();

closeAudioDevice();

closeWindow();
