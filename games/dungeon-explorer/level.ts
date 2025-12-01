import { vec } from "@src/math.ts";
import Entity, { Floor, Player, Wall } from "./entity.ts";
import {
  beginMode2D,
  Camera,
  endMode2D,
  getScreenHeight,
  getScreenWidth,
  Vector,
} from "@src/r-core.ts";

type EntityKey = "w" | "f";

class EntityFactory {
  get(
    entityKey: EntityKey,
    position: Vector,
  ): Entity | never {
    switch (entityKey) {
      case "w":
        return new Wall({
          position: position,
        });
      case "f":
        return new Floor({
          position: position,
        });
    }
  }
}

type LevelLayout = EntityKey[][];

interface LevelArgs {
  levelLayout: LevelLayout;
  playerSpawnPosition: Vector;
}

abstract class Level {
  private _entityFactory = new EntityFactory();

  private _player: Player;
  private _levelLayout: Entity[];
  private _camera: Camera;

  constructor({ levelLayout, playerSpawnPosition }: LevelArgs) {
    this._levelLayout = this._parseLevelLayout(levelLayout);

    this._player = new Player({
      position: playerSpawnPosition,
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
    for (const entity of this._levelLayout) {
      entity.update();
    }

    this._player.update();

    this._camera.target = {
      x: this._player.position.x,
      y: this._player.position.y,
    };
  }

  render(): void {
    beginMode2D(this._camera);

    for (const entity of this._levelLayout) {
      entity.render();
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
          this._entityFactory.get(key, vec(columnIndex * 8, rowIndex * 8)),
        );
      }
    }

    return entities;
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
    });
  }
}
