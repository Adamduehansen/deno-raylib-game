// import { vec } from "@src/r-math.ts";
// import Entity, {
//   Beholder,
//   Corner,
//   Floor,
//   Player,
//   StairsDown,
//   StairsUp,
//   Sword,
//   Wall,
// } from "./entity.ts";
// import {
//   beginMode2D,
//   Camera,
//   endMode2D,
//   getScreenHeight,
//   getScreenWidth,
//   Vector,
// } from "@src/r-core.ts";
// import level1Layout from "./level1.txt" with { type: "text" };
// import level2Layout from "./level2.txt" with { type: "text" };
// import Inventory from "./inventory.ts";

import Scene from "@src/scene.ts";
import Game from "@src/game.ts";
import Player from "./player.ts";
import Floor from "./floor.ts";

// interface FactoryEntityProps {
//   position: Vector;
//   level: Level;
//   inventory: Inventory;
// }

// class EntityFactory {
//   get(
//     entityKey: string,
//     props: FactoryEntityProps,
//   ): Entity {
//     switch (entityKey) {
//       case "ws":
//         return new Wall({
//           position: props.position,
//           level: props.level,
//           inventory: props.inventory,
//           variant: "SIDE",
//         });
//       case "wl":
//         return new Wall({
//           position: props.position,
//           level: props.level,
//           inventory: props.inventory,
//           variant: "LEFT",
//         });
//       case "wr":
//         return new Wall({
//           position: props.position,
//           level: props.level,
//           inventory: props.inventory,
//           variant: "RIGHT",
//         });
//       case "f":
//         return new Floor({
//           position: props.position,
//           level: props.level,
//           inventory: props.inventory,
//         });
//       case "b":
//         return new Beholder({
//           position: props.position,
//           level: props.level,
//           inventory: props.inventory,
//         });
//       case "cll":
//         return new Corner({
//           position: props.position,
//           level: props.level,
//           inventory: props.inventory,
//           variant: "LOWER_LEFT",
//         });
//       case "cul":
//         return new Corner({
//           position: props.position,
//           level: props.level,
//           inventory: props.inventory,
//           variant: "UPPER_LEFT",
//         });
//       case "cur":
//         return new Corner({
//           position: props.position,
//           level: props.level,
//           inventory: props.inventory,
//           variant: "UPPER_RIGHT",
//         });
//       case "clr":
//         return new Corner({
//           position: props.position,
//           level: props.level,
//           inventory: props.inventory,
//           variant: "LOWER_RIGHT",
//         });
//       case "su":
//         return new StairsUp({
//           position: props.position,
//           level: props.level,
//           inventory: props.inventory,
//         });
//       case "sd":
//         return new StairsDown({
//           position: props.position,
//           level: props.level,
//           inventory: props.inventory,
//         });
//       case "is":
//         return new Sword({
//           position: props.position,
//           level: props.level,
//           inventory: props.inventory,
//         });
//       default:
//         throw new Error(`Not implemented key "${entityKey}"`);
//     }
//   }
// }

// interface LevelEnemy {
//   entityKey: string;
//   position: Vector;
// }

// interface LevelArgs {
//   levelLayout: string;
//   playerSpawnPosition: Vector;
//   entities: LevelEnemy[];
//   levelManager: LevelManager;
// }

// export default abstract class Level {
//   private _entityFactory = new EntityFactory();

//   private _camera: Camera;
//   private _entities: Entity[];
//   private readonly _levelManager: LevelManager;
//   private readonly _inventory: Inventory;

//   readonly player: Player;
//   readonly levelLayout: Entity[];

//   constructor({
//     levelLayout,
//     playerSpawnPosition,
//     entities,
//     levelManager,
//   }: LevelArgs) {
//     this._levelManager = levelManager;
//     this._inventory = new Inventory();

//     this.levelLayout = this._parseLevelLayout(levelLayout);
//     this._entities = this._parseEntities(entities);

//     this.player = new Player({
//       position: playerSpawnPosition,
//       level: this,
//       inventory: this._inventory,
//     });
//     this._camera = {
//       target: {
//         x: this.player.position.x,
//         y: this.player.position.y,
//       },
//       offset: {
//         x: getScreenWidth() / 2,
//         y: getScreenHeight() / 2,
//       },
//       rotation: 0,
//       zoom: 4,
//     };
//   }

//   update(): void {
//     for (const levelLayout of this.levelLayout) {
//       levelLayout.update();
//     }

//     for (const enemy of this._entities) {
//       enemy.update();
//     }

//     this.player.update();

//     this._camera.target = {
//       x: this.player.position.x,
//       y: this.player.position.y,
//     };
//   }

//   render(): void {
//     beginMode2D(this._camera);

//     for (const levelLayout of this.levelLayout) {
//       levelLayout.render();
//     }

//     for (const enemy of this._entities) {
//       enemy.render();
//     }

//     this.player.render();

//     endMode2D();

//     for (const entity of this._inventory.items) {
//       entity.render();
//     }
//   }

//   destroy(entityToRemove: Entity): void {
//     this._entities = this._entities.filter((entity) =>
//       entity.id !== entityToRemove.id
//     );
//   }

//   goUpstairs(): void {
//     this._levelManager.setLevel("level2");
//   }

//   goDownstairs(): void {
//     this._levelManager.setLevel("level1");
//   }

//   private _parseLevelLayout(levelLayout: string): Entity[] {
//     const entities: Entity[] = [];
//     const rows = levelLayout.split("\n");
//     for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
//       const row = rows[rowIndex];
//       const columns = row.split(",").map((column) => column.trim());
//       for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
//         const key = columns[columnIndex];
//         entities.push(
//           this._entityFactory.get(key, {
//             level: this,
//             position: vec(columnIndex * 8, rowIndex * 8),
//             inventory: this._inventory,
//           }),
//         );
//       }
//     }

//     return entities;
//   }

//   private _parseEntities(enemies: LevelEnemy[]): Entity[] {
//     return enemies.map((enemy) =>
//       this._entityFactory.get(enemy.entityKey, {
//         position: enemy.position,
//         level: this,
//         inventory: this._inventory,
//       })
//     );
//   }
// }

// export class Level1 extends Level {
//   constructor(levelManager: LevelManager) {
//     super({
//       levelLayout: level1Layout,
//       playerSpawnPosition: vec(2 * 8, 2 * 8),
//       levelManager: levelManager,
//       entities: [{
//         entityKey: "b",
//         position: vec(8 * 8, 8 * 8),
//       }],
//     });
//   }
// }

// export class Level2 extends Level {
//   constructor(levelManager: LevelManager) {
//     super({
//       levelLayout: level2Layout,
//       playerSpawnPosition: vec(8 * 8, 4 * 8),
//       levelManager: levelManager,
//       entities: [{
//         entityKey: "is",
//         position: vec(2 * 8, 4 * 8),
//       }],
//     });
//   }
// }

// export class LevelManager {
//   currentLevel: Level;

//   readonly levels = {
//     "level1": new Level1(this),
//     "level2": new Level2(this),
//   } as const;

//   constructor() {
//     this.currentLevel = this.levels["level1"];
//   }

//   setLevel(level: keyof typeof this.levels) {
//     this.currentLevel = this.levels[level];
//   }
// }

export default class LevelScene extends Scene {
  private _player = new Player();

  override onInitialize(game: Game): void {
    for (let index = 0; index < 4; index++) {
      const floor = new Floor();
      floor.position.x = 8 * index;
      this.entityManager.add(floor);
    }

    this.entityManager.add(this._player);

    this.camera = {
      target: {
        x: this._player.position.x,
        y: this._player.position.y,
      },
      offset: {
        x: game.window.width / 2,
        y: game.window.height / 2,
      },
      rotation: 0,
      zoom: 4,
    };
  }

  override onUpdate(game: Game): void {
    super.onUpdate(game);

    this.camera.target = {
      x: this._player.position.x,
      y: this._player.position.y,
    };
  }
}
