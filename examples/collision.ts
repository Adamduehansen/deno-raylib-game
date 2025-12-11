import Game from "@src/game.ts";
import Scene from "@src/scene.ts";
import Entity from "@src/entity.ts";
import { vec } from "@src/math.ts";
import { RectangleBody } from "@src/body.ts";
import { Green } from "@src/r-core.ts";

class Player extends Entity {
  constructor() {
    super({
      height: 25,
      width: 25,
      color: Green,
      position: vec(100, 150),
    });
    this.body.collisionType = "active";
  }

  override update(scene: Scene, game: Game): void {
    super.update(scene, game);

    if (game.input.keyboard.isKeyDown("A")) {
      this.velocity.x = -2;
    } else if (game.input.keyboard.isKeyDown("D")) {
      this.velocity.x = 2;
    } else {
      this.velocity.x = 0;
    }

    if (game.input.keyboard.isKeyDown("W")) {
      this.velocity.y = -2;
    } else if (game.input.keyboard.isKeyDown("S")) {
      this.velocity.y = 2;
    } else {
      this.velocity.y = 0;
    }
  }

  override onCollisionStart(_scene: Scene): void {
    console.log("Player: started...");
  }

  override onCollisionEnd(_scene: Scene): void {
    console.log("Player: ended...");
  }
}

class Prevent extends Entity {
  constructor() {
    super({
      width: 25,
      height: 25,
      position: vec(100, 100),
      body: new RectangleBody(25, 25),
    });
  }

  override onCollisionStart(_scene: Scene): void {
    console.log("Prevent: started...");
  }

  override onCollisionEnd(_scene: Scene): void {
    console.log("Prevent: ended...");
  }
}

class Passive extends Entity {
  constructor() {
    super({
      width: 25,
      height: 25,
      position: vec(150, 100),
      body: new RectangleBody(25, 25),
    });
    this.body.collisionType = "passive";
  }

  override onCollisionStart(_scene: Scene): void {
    console.log("Passive: started...");
  }

  override onCollisionEnd(_scene: Scene): void {
    console.log("Passive: ended...");
  }
}

class MainScene extends Scene {
  private _player: Entity;

  constructor() {
    super();

    this._player = new Player();
    this.entityManager.add(this._player);
    this.entityManager.add(new Prevent());
    this.entityManager.add(new Passive());
  }
}

const game = new Game({
  title: "Example - Collision tests",
  width: 800,
  height: 450,
  fps: 60,
  scenes: {
    "main": new MainScene(),
  },
  currentScene: "main",
});

game.initialize();

game.run();

game.close();
