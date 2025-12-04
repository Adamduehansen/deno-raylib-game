import { Image } from "@src/resource.ts";

const cwd = import.meta.dirname;

export const Resources = {
  spriteSheet: new Image(cwd + "/spritesheet.png"),
} as const;
