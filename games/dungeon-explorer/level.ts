import { vec } from "@src/math.ts";
import Entity, { Beholder, Corner, Floor, Player, Wall } from "./entity.ts";
import {
  beginMode2D,
  Camera,
  endMode2D,
  getScreenHeight,
  getScreenWidth,
  Vector,
} from "@src/r-core.ts";

type EntityKey = "f" | "b" | "cul" | "cur" | "cll" | "clr" | "ws" | "wl" | "wr";

interface FactoryEntityProps {
  position: Vector;
  level: Level;
}

class EntityFactory {
  get(
    entityKey: EntityKey,
    props: FactoryEntityProps,
  ): Entity | never {
    switch (entityKey) {
      case "ws":
        return new Wall({
          position: props.position,
          level: props.level,
          variant: "SIDE",
        });
      case "wl":
        return new Wall({
          position: props.position,
          level: props.level,
          variant: "LEFT",
        });
      case "wr":
        return new Wall({
          position: props.position,
          level: props.level,
          variant: "RIGHT",
        });
      case "f":
        return new Floor({
          position: props.position,
          level: props.level,
        });
      case "b":
        return new Beholder({
          position: props.position,
          level: props.level,
        });
      case "cll":
        return new Corner({
          position: props.position,
          level: props.level,
          variant: "LOWER_LEFT",
        });
      case "cul":
        return new Corner({
          position: props.position,
          level: props.level,
          variant: "UPPER_LEFT",
        });
      case "cur":
        return new Corner({
          position: props.position,
          level: props.level,
          variant: "UPPER_RIGHT",
        });
      case "clr":
        return new Corner({
          position: props.position,
          level: props.level,
          variant: "LOWER_RIGHT",
        });
    }
  }
}

type LevelLayout = EntityKey[][];

interface LevelEnemy {
  entityKey: EntityKey;
  position: Vector;
}

interface LevelArgs {
  levelLayout: LevelLayout;
  playerSpawnPosition: Vector;
  enemies: LevelEnemy[];
}

export default abstract class Level {
  private _entityFactory = new EntityFactory();

  private _camera: Camera;
  private _enemies: Entity[];

  readonly player: Player;
  readonly levelLayout: Entity[];

  constructor({ levelLayout, playerSpawnPosition, enemies }: LevelArgs) {
    this.levelLayout = this._parseLevelLayout(levelLayout);
    this._enemies = this._parseEnemies(enemies);

    this.player = new Player({
      position: playerSpawnPosition,
      level: this,
    });
    this._camera = {
      target: {
        x: this.player.position.x,
        y: this.player.position.y,
      },
      offset: {
        x: getScreenWidth() / 2,
        y: getScreenHeight() / 2,
      },
      rotation: 0,
      zoom: 4,
    };
  }

  update(): void {
    for (const levelLayout of this.levelLayout) {
      levelLayout.update();
    }

    for (const enemy of this._enemies) {
      enemy.update();
    }

    this.player.update();

    this._camera.target = {
      x: this.player.position.x,
      y: this.player.position.y,
    };
  }

  render(): void {
    beginMode2D(this._camera);

    for (const levelLayout of this.levelLayout) {
      levelLayout.render();
    }

    for (const enemy of this._enemies) {
      enemy.render();
    }

    this.player.render();

    endMode2D();
  }

  private _parseLevelLayout(levelLayout: LevelLayout): Entity[] {
    const entities: Entity[] = [];
    for (let rowIndex = 0; rowIndex < levelLayout.length; rowIndex++) {
      const row = levelLayout[rowIndex];
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const key = row[columnIndex];
        entities.push(
          this._entityFactory.get(key, {
            level: this,
            position: vec(columnIndex * 8, rowIndex * 8),
          }),
        );
      }
    }

    return entities;
  }

  private _parseEnemies(enemies: LevelEnemy[]): Entity[] {
    return enemies.map((enemy) =>
      this._entityFactory.get(enemy.entityKey, {
        position: enemy.position,
        level: this,
      })
    );
  }
}

export class Level1 extends Level {
  constructor() {
    super({
      levelLayout: [
        [
          "cul",
          "ws",
          "ws",
          "ws",
          "ws",
          "ws",
          "ws",
          "ws",
          "ws",
          "ws",
          "ws",
          "cur",
        ],
        ["wl", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "wr"],
        ["wl", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "wr"],
        ["wl", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "wr"],
        ["wl", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "wr"],
        ["wl", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "wr"],
        ["wl", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "wr"],
        ["wl", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "wr"],
        ["wl", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "wr"],
        ["wl", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "wr"],
        ["wl", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "wr"],
        [
          "cll",
          "ws",
          "ws",
          "ws",
          "ws",
          "ws",
          "ws",
          "ws",
          "ws",
          "ws",
          "ws",
          "clr",
        ],
      ],
      playerSpawnPosition: vec(2 * 8, 2 * 8),
      enemies: [{
        entityKey: "b",
        position: vec(4 * 8, 4 * 8),
      }],
    });
  }
}
