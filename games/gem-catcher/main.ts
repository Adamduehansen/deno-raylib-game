import {
  beginDrawing,
  checkCollisionRecs,
  closeWindow,
  drawFPS,
  drawText,
  drawTexture,
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
  loadTexture,
  measureText,
  Rectangle,
  setTargetFPS,
  Texture,
  unloadTexture,
  White,
  windowShouldClose,
} from "../../raylib-bindings.ts";

initWindow({
  title: "Gem Catcher",
  width: 1152,
  height: 648,
});

const PaddleWidth = 104;

const bgTexture = loadTexture("./games/gem-catcher/assets/GameBg.png");
const paddleTexture = loadTexture("./games/gem-catcher/assets/paddleBlu.png");
const starTexture = loadTexture(
  "./games/gem-catcher/assets/element_red_diamond.png",
);

setTargetFPS(60);

let score = 0;
let paused: boolean = false;
let gameOver: boolean = false;

interface Vector {
  x: number;
  y: number;
}

interface EntityArgs {
  texture: Texture;
  name: string;
}

abstract class Entity {
  pos: Vector;
  texture: Texture;

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
    this.world?.remove(this);
  }

  getRect(): Rectangle {
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

    const paddle = this.world?.entities.find((entity) =>
      entity.name === "PlayerPaddle"
    );
    if (paddle !== undefined && this.hasCollidingWith(paddle)) {
      score += 1;
      this.destroy();
    }

    if (this.pos.y > getScreenHeight()) {
      gameOver = true;
      this.destroy();
    }
  }
}

class World {
  #entities: Entity[] = [];

  get entities(): readonly Entity[] {
    return this.#entities;
  }

  add(entity: Entity): void {
    this.#entities.push(entity);
    entity.world = this;
  }

  remove(entityToRemove: Entity): void {
    this.#entities = this.#entities.filter((entity) =>
      entity.id !== entityToRemove.id
    );
  }
}

const world = new World();

const background = new Background();
background.pos.x = 0;
background.pos.y = 0;
world.add(background);

const playerPaddle = new PlayerPaddle();
playerPaddle.pos.x = getScreenWidth() / 2 - PaddleWidth / 2;
playerPaddle.pos.y = getScreenHeight() - 50;
world.add(playerPaddle);

let starSpawnTimer = 0;

while (windowShouldClose() === false) {
  // Input handling
  // --------------------------------------------------------------------------
  if (isKeyPressed(KeyP)) {
    paused = !paused;
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
      world.add(star);
      starSpawnTimer = 0;
    }

    if (paused === false) {
      for (const entity of world.entities) {
        entity.update();
      }
    }
  }

  // Drawing
  // --------------------------------------------------------------------------
  beginDrawing();
  for (const entity of world.entities) {
    entity.render();
  }
  drawFPS(10, 10);
  drawText({
    text: `Amount of stars: ${
      world.entities.filter((entity) => entity.name === "Star").length
    }`,
    color: White,
    fontSize: 24,
    posX: 10,
    posY: 40,
  });
  drawText({
    text: `Toal amount of entities: ${world.entities.length}`,
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
  }
  endDrawing();
}

unloadTexture(starTexture);
unloadTexture(paddleTexture);
unloadTexture(bgTexture);

closeWindow();
