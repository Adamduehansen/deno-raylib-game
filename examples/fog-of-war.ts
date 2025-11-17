import {
  beginDrawing,
  closeWindow,
  endDrawing,
  getRandomValue,
  initWindow,
  loadRenderTexture,
  setTargetFPS,
  setTextureFilter,
  unloadRenderTexture,
  windowShouldClose,
} from "../raylib-bindings.ts";
import { Vector } from "@src/math.ts";

interface Map {
  tilesX: number; // Number of tiles in X axis
  tilesY: number; // Number of tiles in Y axis
  tileIds: number[]; // Tile ids (tilesX*tilesY), defines type of tile to draw
  tileFog: number[]; // Tile fog state (tilesX*tilesY), defines if a tile has fog or half-fog
}

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 450;

initWindow({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  title: "raylib [textures] example - fog of war",
});

const map: Map = {
  tilesX: 25,
  tilesY: 15,
  tileIds: Array.from({ length: 25 * 15 }).map((): number =>
    getRandomValue(0, 1)
  ),
  tileFog: [],
};

let playerPosition: Vector = {
  x: 180,
  y: 130,
};

let playerTileX = 0;
let playerTileY = 0;

const fogOfWar = loadRenderTexture(map.tilesX, map.tilesY);
setTextureFilter(fogOfWar.texture, 1); // 1 = TEXTURE_FILTER_BILINEAR

setTargetFPS(60);
// ----------------------------------------------------------------------------

while (windowShouldClose() === false) {
  beginDrawing();

  endDrawing();
}

unloadRenderTexture(fogOfWar);

closeWindow();
