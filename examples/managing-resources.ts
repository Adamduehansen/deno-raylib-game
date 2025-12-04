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
import { Graphics, Sprite } from "@src/graphics.ts";

initWindow({
  title: "Examples - managing resources",
  height: 450,
  width: 800,
});

setTargetFPS(60);

initAudioDevice();

const resourceFolderPath = import.meta.dirname + "/resources";

const Resources = {
  spritesheetImage: new Image(resourceFolderPath + "/scarfy.png"),
  sound: new Sound(resourceFolderPath + "/boom.wav"),
} as const;

const resourceManager = new ResourceManager(Object.values(Resources));

resourceManager.load();

const sprite = new Sprite({
  image: Resources.spritesheetImage,
  sourceView: {
    x: 0,
    y: 0,
    height: 128,
    width: 128,
  },
});

const graphics = new Graphics();
graphics.use(sprite);

while (windowShouldClose() === false) {
  beginDrawing();

  clearBackground(White);

  graphics.render();

  endDrawing();
}

resourceManager.unload();

closeAudioDevice();

closeWindow();
