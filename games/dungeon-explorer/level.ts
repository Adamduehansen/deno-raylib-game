import { vec } from "@src/math.ts";
import Entity, { Beholder, Floor, Player, Wall } from "./entity.ts";
import {
  beginMode2D,
  Camera,
  endMode2D,
  getScreenHeight,
  getScreenWidth,
  Vector,
} from "@src/r-core.ts";

type EntityKey = "w" | "f" | "b";

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
      case "w":
        return new Wall({
          position: props.position,
          level: props.level,
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

  private _player: Player;
  private _camera: Camera;
  private _enemies: Entity[];

  readonly levelLayout: Entity[];

  constructor({ levelLayout, playerSpawnPosition, enemies }: LevelArgs) {
    this.levelLayout = this._parseLevelLayout(levelLayout);
    this._enemies = this._parseEnemies(enemies);

    this._player = new Player({
      position: playerSpawnPosition,
      level: this,
    });
    this._camera = {
      target: {
        x: this._player.position.x,
        y: this._player.position.y,
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

    this._player.update();

    this._camera.target = {
      x: this._player.position.x,
      y: this._player.position.y,
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

    this._player.render();

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
        ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
        ["w", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "w"],
        ["w", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "w"],
        ["w", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "w"],
        ["w", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "w"],
        ["w", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "w"],
        ["w", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "w"],
        ["w", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "w"],
        ["w", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "w"],
        ["w", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "w"],
        ["w", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "w"],
        ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
      ],
      playerSpawnPosition: vec(2 * 8, 2 * 8),
      enemies: [{
        entityKey: "b",
        position: vec(4 * 8, 4 * 8),
      }],
    });
  }
}
