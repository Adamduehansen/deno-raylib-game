import {
  beginDrawing,
  closeWindow,
  drawText,
  drawTexture,
  endDrawing,
  getFrameTime,
  getScreenHeight,
  getScreenWidth,
  initWindow,
  isKeyDown,
  KeyA,
  KeyD,
  loadTexture,
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

  abstract update(): void;
}

class PlayerPaddle extends Entity {
  readonly #speed: number = 10;

  constructor() {
    super({
      texture: paddleTexture,
      name: "Player",
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

    if (this.pos.y > getScreenHeight()) {
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
  // Update
  // --------------------------------------------------------------------------
  const frameTime = getFrameTime();
  starSpawnTimer += frameTime;
  if (starSpawnTimer > 1) {
    const star = new Star();
    star.pos.y = -starTexture.height;
    const x = Math.floor(Math.random() * getScreenWidth() - starTexture.width);
    star.pos.x = x;
    world.add(star);
    starSpawnTimer = 0;
  }

  for (const entity of world.entities) {
    entity.update();
  }

  // Drawing
  // --------------------------------------------------------------------------
  beginDrawing();
  for (const entity of world.entities) {
    entity.render();
  }
  drawText({
    text: `Amount of stars: ${
      world.entities.filter((entity) => entity.name === "Star").length
    }`,
    color: White,
    fontSize: 24,
    posX: 10,
    posY: 10,
  });
  drawText({
    text: `Toal amount of entities: ${world.entities.length}`,
    color: White,
    fontSize: 24,
    posX: 10,
    posY: 40,
  });
  endDrawing();
}

unloadTexture(paddleTexture);
unloadTexture(bgTexture);

closeWindow();
