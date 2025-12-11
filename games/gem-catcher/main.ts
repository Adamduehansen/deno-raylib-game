import { RaylibRectangle } from "@src/r-shapes.ts";
import {
  closeAudioDevice,
  initAudioDevice,
  loadMusicStream,
  loadSound,
  playMusicStream,
  playSound,
  unloadMusicStream,
  unloadSound,
  updateMusicStream,
} from "@src/r-audio.ts";
import {
  beginDrawing,
  clearBackground,
  closeWindow,
  endDrawing,
  getFrameTime,
  getScreenHeight,
  getScreenWidth,
  initWindow,
  isKeyDown,
  isKeyPressed,
  KeyA,
  KeyD,
  KeyP,
  KeyR,
  RaylibTexture,
  RayWhite,
  setTargetFPS,
  White,
  windowShouldClose,
} from "@src/r-core.ts";
import { checkCollisionRecs } from "@src/r-shapes.ts";
import { drawFPS, drawText, measureText } from "@src/r-text.ts";
import { drawTexture, loadTexture, unloadTexture } from "@src/r-textures.ts";

let score = 0;
let paused: boolean = false;
let gameOver: boolean = false;

interface Vector {
  x: number;
  y: number;
}

interface EntityArgs {
  texture: RaylibTexture;
  name: string;
}

abstract class Entity {
  pos: Vector;
  texture: RaylibTexture;

  readonly name: string;
  readonly id: string;

  world?: World;

  constructor(args: EntityArgs) {
    this.pos = {
      x: 0,
      y: 0,
    };
    this.name = args.name;
    this.texture = args.texture;
    this.id = crypto.randomUUID();
  }

  render(): void {
    drawTexture({
      texture: this.texture,
      x: this.pos.x,
      y: this.pos.y,
      color: White,
    });
  }

  destroy() {
    this.world?.entityManager.remove(this);
  }

  getRect(): RaylibRectangle {
    return {
      x: this.pos.x,
      y: this.pos.y,
      width: this.texture.width,
      height: this.texture.height,
    };
  }

  hasCollidingWith(entity: Entity): boolean {
    return checkCollisionRecs(this.getRect(), entity.getRect());
  }

  abstract update(): void;
}

class PlayerPaddle extends Entity {
  readonly #speed: number = 10;

  constructor() {
    super({
      texture: paddleTexture,
      name: "PlayerPaddle",
    });
  }

  override update(): void {
    if (
      isKeyDown(KeyD) && this.pos.x < getScreenWidth() - this.texture.width
    ) {
      this.pos.x += this.#speed;
    }
    if (isKeyDown(KeyA) && this.pos.x > 0) {
      this.pos.x -= this.#speed;
    }
  }
}

class Background extends Entity {
  constructor() {
    super({
      texture: bgTexture,
      name: "Background",
    });
  }

  override update(): void {}
}

class Star extends Entity {
  constructor() {
    super({
      texture: starTexture,
      name: "Star",
    });
  }

  override update(): void {
    this.pos.y += 5;

    const paddle = this.world?.entityManager.entities.find((entity) =>
      entity.name === "PlayerPaddle"
    );
    if (paddle !== undefined && this.hasCollidingWith(paddle)) {
      score += 1;
      playSound(spellSound);
      this.destroy();
    }

    if (this.pos.y > getScreenHeight()) {
      gameOver = true;
      playSound(explodeSound);
      this.destroy();
    }
  }
}

class EntityManager {
  #entities: Entity[] = [];
  #world: World;

  get entities(): readonly Entity[] {
    return this.#entities;
  }

  constructor(world: World) {
    this.#world = world;
  }

  add(entity: Entity): void {
    this.#entities.push(entity);
    entity.world = this.#world;
  }

  remove(entityToRemove: Entity): void {
    this.#entities = this.#entities.filter((entity) =>
      entity.id !== entityToRemove.id
    );
  }

  clear(predicate: (entity: Entity) => boolean): void {
    for (const entity of this.#entities.filter(predicate)) {
      entity.destroy();
    }
  }
}

class World {
  readonly entityManager: EntityManager = new EntityManager(this);
}

initWindow({
  title: "Gem Catcher",
  width: 1152,
  height: 648,
});

initAudioDevice();

const spellSound = loadSound("./games/gem-catcher/assets/spell1_0.wav");
const explodeSound = loadSound("./games/gem-catcher/assets/explode.wav");

const backgroundMusic = loadMusicStream(
  "./games/gem-catcher/assets/bgm_action_5.mp3",
);

const bgTexture = loadTexture("./games/gem-catcher/assets/GameBg.png");
const paddleTexture = loadTexture("./games/gem-catcher/assets/paddleBlu.png");
const starTexture = loadTexture(
  "./games/gem-catcher/assets/element_red_diamond.png",
);

setTargetFPS(60);

const world = new World();

const background = new Background();
background.pos.x = 0;
background.pos.y = 0;
world.entityManager.add(background);

const playerPaddle = new PlayerPaddle();
const PaddleWidth = 104;
playerPaddle.pos.x = getScreenWidth() / 2 - PaddleWidth / 2;
playerPaddle.pos.y = getScreenHeight() - 50;
world.entityManager.add(playerPaddle);

let starSpawnTimer = 0;

playMusicStream(backgroundMusic);

while (windowShouldClose() === false) {
  updateMusicStream(backgroundMusic);

  // Input handling
  // --------------------------------------------------------------------------
  if (isKeyPressed(KeyP)) {
    paused = !paused;
  }

  if (gameOver && isKeyPressed(KeyR)) {
    world.entityManager.clear((entity: Entity) => entity.name === "Star");
    playerPaddle.pos.x = getScreenWidth() / 2 - PaddleWidth / 2;
    score = 0;
    gameOver = false;
  }

  // Update
  // --------------------------------------------------------------------------
  if (gameOver === false) {
    const frameTime = getFrameTime();
    if (paused === false) {
      starSpawnTimer += frameTime;
    }
    if (starSpawnTimer > 1) {
      const star = new Star();
      star.pos.y = -starTexture.height;
      const x = Math.floor(
        Math.random() * getScreenWidth() - starTexture.width,
      );
      star.pos.x = x;
      world.entityManager.add(star);
      starSpawnTimer = 0;
    }

    if (paused === false) {
      for (const entity of world.entityManager.entities) {
        entity.update();
      }
    }
  }

  // Drawing
  // --------------------------------------------------------------------------
  beginDrawing();
  clearBackground(RayWhite);

  for (const entity of world.entityManager.entities) {
    entity.render();
  }
  drawFPS(10, 10);
  drawText({
    text: `Amount of stars: ${
      world.entityManager.entities.filter((entity) => entity.name === "Star")
        .length
    }`,
    color: White,
    fontSize: 24,
    posX: 10,
    posY: 40,
  });
  drawText({
    text: `Toal amount of entities: ${world.entityManager.entities.length}`,
    color: White,
    fontSize: 24,
    posX: 10,
    posY: 80,
  });
  drawText({
    text: `Score: ${score}`,
    color: White,
    fontSize: 24,
    posX: 10,
    posY: 120,
  });
  if (gameOver) {
    drawText({
      text: "Game Over!",
      color: White,
      fontSize: 32,
      posX: getScreenWidth() / 2 - measureText("Game Over!", 32) / 2,
      posY: getScreenHeight() / 2,
    });
    drawText({
      text: "Press R to restart",
      color: White,
      fontSize: 32,
      posX: getScreenWidth() / 2 - measureText("Press R to restart", 32) / 2,
      posY: (getScreenHeight() / 2) + 35,
    });
  }
  endDrawing();
}

unloadTexture(starTexture);
unloadTexture(paddleTexture);
unloadTexture(bgTexture);

unloadMusicStream(backgroundMusic);

unloadSound(spellSound);
unloadSound(explodeSound);

closeAudioDevice();

closeWindow();
