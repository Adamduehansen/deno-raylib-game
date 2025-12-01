import { vec } from "@src/math.ts";
import Entity, {
  Beholder,
  Corner,
  Floor,
  Player,
  StairsDown,
  StairsUp,
  Wall,
} from "./entity.ts";
import {
  beginMode2D,
  Camera,
  endMode2D,
  getScreenHeight,
  getScreenWidth,
  Vector,
} from "@src/r-core.ts";
import level1Layout from "./level1.txt" with { type: "text" };
import level2Layout from "./level2.txt" with { type: "text" };

interface FactoryEntityProps {
  position: Vector;
  level: Level;
}

class EntityFactory {
  get(
    entityKey: string,
    props: FactoryEntityProps,
  ): Entity {
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
      case "su":
        return new StairsUp({
          position: props.position,
          level: props.level,
        });
      case "sd":
        return new StairsDown({
          position: props.position,
          level: props.level,
        });
      default:
        throw new Error(`Not implemented key "${entityKey}"`);
    }
  }
}

interface LevelEnemy {
  entityKey: string;
  position: Vector;
}

interface LevelArgs {
  levelLayout: string;
  playerSpawnPosition: Vector;
  enemies: LevelEnemy[];
  levelManager: LevelManager;
}

export default abstract class Level {
  private _entityFactory = new EntityFactory();

  private _camera: Camera;
  private _enemies: Entity[];
  private readonly _levelManager: LevelManager;

  readonly player: Player;
  readonly levelLayout: Entity[];

  constructor({
    levelLayout,
    playerSpawnPosition,
    enemies,
    levelManager,
  }: LevelArgs) {
    this._levelManager = levelManager;

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

  goUpstairs(): void {
    this._levelManager.setLevel("level2");
  }

  goDownstairs(): void {
    this._levelManager.setLevel("level1");
  }

  private _parseLevelLayout(levelLayout: string): Entity[] {
    const entities: Entity[] = [];
    const rows = levelLayout.split("\n");
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const columns = row.split(",").map((column) => column.trim());
      for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        const key = columns[columnIndex];
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
  constructor(levelManager: LevelManager) {
    super({
      levelLayout: level1Layout,
      playerSpawnPosition: vec(2 * 8, 2 * 8),
      levelManager: levelManager,
      enemies: [{
        entityKey: "b",
        position: vec(8 * 8, 8 * 8),
      }],
    });
  }
}

export class Level2 extends Level {
  constructor(levelManager: LevelManager) {
    super({
      levelLayout: level2Layout,
      playerSpawnPosition: vec(8 * 8, 4 * 8),
      levelManager: levelManager,
      enemies: [],
    });
  }
}

export class LevelManager {
  currentLevel: Level;

  readonly levels = {
    "level1": new Level1(this),
    "level2": new Level2(this),
  } as const;

  constructor() {
    this.currentLevel = this.levels["level1"];
  }

  setLevel(level: keyof typeof this.levels) {
    this.currentLevel = this.levels[level];
  }
}
