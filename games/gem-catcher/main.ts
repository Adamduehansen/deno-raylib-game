import {
  beginDrawing,
  closeWindow,
  drawTexture,
  endDrawing,
  getScreenHeight,
  getScreenWidth,
  initWindow,
  isKeyDown,
  KeyA,
  KeyD,
  loadTexture,
  setTargetFPS,
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

setTargetFPS(60);

interface Vector {
  x: number;
  y: number;
}

interface EntityArgs {
  pos: Vector;
}

abstract class Entity {
  pos: Vector;

  constructor(args: EntityArgs) {
    this.pos = args.pos;
  }

  abstract update(): void;
  abstract render(): void;
}

const PlayerPaddleSpeed = 10;

class PlayerPaddle extends Entity {
  override update(): void {
    if (
      isKeyDown(KeyD) && this.pos.x < getScreenWidth() - paddleTexture.width
    ) {
      this.pos.x += PlayerPaddleSpeed;
    }
    if (isKeyDown(KeyA) && this.pos.x > 0) {
      this.pos.x -= PlayerPaddleSpeed;
    }
  }

  override render(): void {
    drawTexture({
      texture: paddleTexture,
      x: this.pos.x,
      y: this.pos.y,
      color: White,
    });
  }
}

class Background extends Entity {
  override update(): void {}

  override render(): void {
    drawTexture({
      texture: bgTexture,
      x: this.pos.x,
      y: this.pos.y,
      color: White,
    });
  }
}

class World {
  #entities: Entity[] = [];

  get entities(): readonly Entity[] {
    return this.#entities;
  }

  add(entity: Entity): void {
    this.#entities.push(entity);
  }
}

const world = new World();
const background = new Background({
  pos: {
    x: 0,
    y: 0,
  },
});
world.add(background);
const playerPaddle = new PlayerPaddle({
  pos: {
    x: getScreenWidth() / 2 - PaddleWidth / 2,
    y: getScreenHeight() - 50,
  },
});

world.add(playerPaddle);

while (windowShouldClose() === false) {
  // Update
  // --------------------------------------------------------------------------
  for (const entity of world.entities) {
    entity.update();
  }

  // Drawing
  // --------------------------------------------------------------------------
  beginDrawing();
  for (const entity of world.entities) {
    entity.render();
  }
  endDrawing();
}

unloadTexture(paddleTexture);
unloadTexture(bgTexture);

closeWindow();
