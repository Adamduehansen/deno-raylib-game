import * as xml from "@libs/xml";
import { loadTexture, unloadTexture } from "@src/r-textures.ts";
import { Texture } from "@src/r-core.ts";

interface Resource {
  unload: () => void;
}

export class TextureResource implements Resource {
  texture: Texture;

  constructor(path: string) {
    this.texture = loadTexture(path);
  }

  unload(): void {
    unloadTexture(this.texture);
  }
}

interface Layer {
  name: string;
  width: number;
  height: number;
  text: string;
}

export class TiledResource implements Resource {
  private _layers: Layer[] = [];
  private _tileset: Texture;

  constructor(path: string) {
    const levelFileContent = Deno.readTextFileSync(path);
    const levelXml = xml.parse(levelFileContent);

    const tilesetSource = levelXml.map.tileset["@source"];
    const pathToTileset = `${import.meta.dirname}/${tilesetSource}`;
    this._tileset = this.getTileset(pathToTileset);

    for (const layer of levelXml.map.layer) {
      const name = layer["@name"];
      const width = layer["@width"];
      const height = layer["@height"];

      this._layers.push({
        name: name,
        height: parseInt(width),
        width: parseInt(height),
        text: layer["#text"],
      });
    }
  }

  unload(): void {
    unloadTexture(this._tileset);
  }

  private getTileset(pathToTileset: string): Texture {
    const tilesetFileContent = Deno.readTextFileSync(pathToTileset);
    const tilesetXml = xml.parse(tilesetFileContent);
    const imageSource = tilesetXml.tileset.image["@source"];
    const pathToImageSource = `${import.meta.dirname}/${imageSource}`;
    return loadTexture(pathToImageSource);
  }
}

export default class ResourceManager {
  static #instance: ResourceManager;

  #resources: Map<string, Resource> = new Map<string, Resource>();

  private constructor() {}

  load(key: string, resource: Resource): void {
    this.#resources.set(key, resource);
  }

  get<T extends Resource>(key: string): T {
    const resource = this.#resources.get(key);
    if (resource === undefined) {
      throw new Error(`Coule not get resource "${key}". Is it loaded?`);
    }

    return resource as T;
  }

  unload(): void {
    for (const resource of this.#resources.values()) {
      resource.unload();
    }
  }

  static getInstance(): ResourceManager {
    if (this.#instance === undefined) {
      this.#instance = new ResourceManager();
    }

    return this.#instance;
  }
}
