import { Vector } from "@src/math.ts";
import {
  beginDrawing,
  beginTextureMode,
  Black,
  Blank,
  Blue,
  clearBackground,
  closeWindow,
  DarkBlue,
  drawRectangle,
  drawRectangleLines,
  drawRectangleV,
  drawText,
  drawTexturePro,
  endDrawing,
  endTextureMode,
  fade,
  getRandomValue,
  initWindow,
  isKeyDown,
  KeyDown,
  KeyLeft,
  KeyRight,
  KeyUp,
  loadRenderTexture,
  RayWhite,
  Red,
  setTargetFPS,
  setTextureFilter,
  unloadRenderTexture,
  White,
  windowShouldClose,
} from "@src/raylib-bindings.ts";

interface Map {
  tilesX: number; // Number of tiles in X axis
  tilesY: number; // Number of tiles in Y axis
  tileIds: number[]; // Tile ids (tilesX*tilesY), defines type of tile to draw
  tileFog: number[]; // Tile fog state (tilesX*tilesY), defines if a tile has fog or half-fog
}

const PLAYER_SIZE = 16;
const MAP_TILE_SIZE = 32;
const PLAYER_TILE_VISIBILITY = 2;

const UNDISCOVERED = 0;
const IN_VIEW = 1;
const DISCOVERED = 2;

// Initialization
//-----------------------------------------------------------------------------
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
  tileIds: [],
  tileFog: [],
};

// NOTE: We can have up to 256 values for tile ids and for tile fog state,
// probably we don't need that many values for fog state, it can be optimized
// to use only 2 bits per fog state (reducing size by 4) but logic will be a bit more complex
map.tileIds = new Array(map.tilesX * map.tilesY).fill(0);
map.tileFog = new Array(map.tilesX * map.tilesY).fill(0);

// Load map tiles (generating 2 random tile ids for testing)
// NOTE: Map tile ids should be probably loaded from an external map file
map.tileIds = map.tileIds.map(() => getRandomValue(0, 1));

// Player position on the screen (pixel coordinates, not tile coordinates)
const playerPosition: Vector = {
  x: 180,
  y: 130,
};
let playerTileX = 0;
let playerTileY = 0;

// Render texture to render fog of war
// NOTE: To get an automatic smooth-fog effect we use a render texture to render fog
// at a smaller size (one pixel per tile) and scale it on drawing with bilinear filtering
const fogOfWar = loadRenderTexture(map.tilesX, map.tilesY);
setTextureFilter(fogOfWar.texture, 1); // 1 = TEXTURE_FILTER_BILINEAR

// Set our game to run at 60 frames-per-second
setTargetFPS(60);
// ----------------------------------------------------------------------------

while (windowShouldClose() === false) {
  // Update
  // --------------------------------------------------------------------------
  // Move player around
  if (isKeyDown(KeyRight)) {
    playerPosition.x += 5;
  }
  if (isKeyDown(KeyLeft)) {
    playerPosition.x -= 5;
  }
  if (isKeyDown(KeyDown)) {
    playerPosition.y += 5;
  }
  if (isKeyDown(KeyUp)) {
    playerPosition.y -= 5;
  }

  // Check player position to avoid moving outside tilemap limits
  if (playerPosition.x < 0) {
    playerPosition.x = 0;
  }

  // Previous visited tiles are set to partial fog
  for (let i = 0; i < map.tilesX * map.tilesY; i++) {
    if (map.tileFog[i] === IN_VIEW) {
      map.tileFog[i] = DISCOVERED;
    }
  }

  // Get current tile position from player pixel position
  playerTileX = Math.floor(
    (playerPosition.x + MAP_TILE_SIZE / 2) / MAP_TILE_SIZE,
  );
  playerTileY = Math.floor(
    (playerPosition.y + MAP_TILE_SIZE / 2) / MAP_TILE_SIZE,
  );

  // Check visibility and update fog
  // NOTE: We check tilemap limits to avoid processing tiles out-of-array-bounds (it could crash program)
  for (
    let y = playerTileY - PLAYER_TILE_VISIBILITY;
    y < (playerTileY + PLAYER_TILE_VISIBILITY);
    y++
  ) {
    for (
      let x = playerTileX - PLAYER_TILE_VISIBILITY;
      x < playerTileX + PLAYER_TILE_VISIBILITY;
      x++
    ) {
      if (x >= 0 && x < map.tilesX && y >= 0 && y < map.tilesY) {
        map.tileFog[y * map.tilesX + x] = IN_VIEW;
      }
    }
  }
  // --------------------------------------------------------------------------

  // Draw
  // --------------------------------------------------------------------------
  // Draw fog of war to a small render texture for automatic smoothing on scaling
  beginTextureMode(fogOfWar);
  clearBackground(Blank);
  for (let y = 0; y < map.tilesY; y++) {
    for (let x = 0; x < map.tilesX; x++) {
      const fogIndex = map.tileFog[y * map.tilesX + x];
      if (fogIndex === UNDISCOVERED) {
        drawRectangle({
          posX: x,
          posY: y,
          height: 1,
          width: 1,
          color: Black,
        });
      } else if (fogIndex === DISCOVERED) {
        drawRectangle({
          posX: x,
          posY: y,
          height: 1,
          width: 1,
          color: fade(Black, 0.8),
        });
      }
    }
  }
  endTextureMode();

  beginDrawing();
  clearBackground(RayWhite);

  // Draw tiles from id (and tile borders)
  for (let y = 0; y < map.tilesY; y++) {
    for (let x = 0; x < map.tilesX; x++) {
      drawRectangle({
        posX: x * MAP_TILE_SIZE,
        posY: y * MAP_TILE_SIZE,
        height: MAP_TILE_SIZE,
        width: MAP_TILE_SIZE,
        color: map.tileIds[y * map.tilesX + x] == 0 ? Blue : fade(Blue, 0.8),
      });
      drawRectangleLines({
        posX: x * MAP_TILE_SIZE,
        posY: y * MAP_TILE_SIZE,
        height: MAP_TILE_SIZE,
        width: MAP_TILE_SIZE,
        color: fade(DarkBlue, 0.5),
      });
    }
  }

  // Draw player
  drawRectangleV(playerPosition, { x: PLAYER_SIZE, y: PLAYER_SIZE }, Red);

  // Draw fog of war (scaled to full map, bilinear filtering)
  drawTexturePro({
    texture: fogOfWar.texture,
    source: {
      x: 0,
      y: 0,
      width: fogOfWar.texture.width,
      height: -fogOfWar.texture.height,
    },
    dest: {
      x: 0,
      y: 0,
      width: map.tilesX * MAP_TILE_SIZE,
      height: map.tilesY * MAP_TILE_SIZE,
    },
    origin: {
      x: 0,
      y: 0,
    },
    rotation: 0,
    tint: White,
  });

  // Draw player current tile
  drawText({
    text: `Current tile: [${playerTileX},${playerTileY}]`,
    posX: 10,
    posY: 10,
    fontSize: 20,
    color: RayWhite,
  });

  endDrawing();
}

unloadRenderTexture(fogOfWar);

closeWindow();
